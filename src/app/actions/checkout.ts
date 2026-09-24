"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthUser } from "@/lib/auth";
import { sendOrderConfirmation } from "@/lib/email";

interface CheckoutPayload {
  vendorId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  deliveryAddress: string;
  deliveryInstructions?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  paystackReference: string;
}

export async function createOrderAfterPayment(payload: CheckoutPayload) {
  try {
    const user = await getAuthUser();
    if (!user) {
      throw new Error("Unauthorized: You must be logged in to checkout.");
    }
    const userId = user.dbUserId;

    // Fetch restaurant data for delivery_fee and whatsapp_number
    const { data: vendorData, error: vendorError } = await supabaseAdmin
      .from('restaurants')
      .select('name, delivery_fee, whatsapp_number')
      .eq('id', payload.vendorId)
      .single();

    if (vendorError || !vendorData) {
      throw new Error("Restaurant not found.");
    }

    // 1. Calculate totals (in Naira)
    const subtotal = payload.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = vendorData.delivery_fee || 500;
    const total = subtotal + deliveryFee;

    // 2. Insert Order (status = 'paid', payment_status = 'paid')
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_id: userId,
        restaurant_id: payload.vendorId,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: 'paid',
        payment_status: 'paid',
        paystack_reference: payload.paystackReference,
        delivery_address: payload.deliveryAddress,
        delivery_notes: payload.deliveryInstructions,
        delivery_lat: payload.deliveryLat,
        delivery_lng: payload.deliveryLng,
        confirmed_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (orderError) throw new Error("Failed to create order: " + orderError.message);

    // 3. Insert Order Items
    const orderItems = payload.items.map(item => ({
      order_id: order.id,
      menu_item_id: item.productId,
      name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      throw new Error("Failed to save order items.");
    }

    // Send confirmation email asynchronously
    const customerEmail = user.email;
    if (customerEmail) {
      sendOrderConfirmation(customerEmail, {
        orderId: order.id,
        customerName: user.fullName || "Customer",
        items: payload.items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        subtotal,
        deliveryFee,
        total,
        vendorName: vendorData.name
      }).catch(console.error);
    }

    return { 
      success: true, 
      orderId: order.id,
      whatsappNumber: vendorData.whatsapp_number,
      customerName: user.fullName,
      customerPhone: user.phone
    };
  } catch (error: any) {
    console.error("Checkout error:", error);
    return { success: false, error: error.message };
  }
}
