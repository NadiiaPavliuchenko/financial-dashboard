import { connectToDatabase } from '../db';
import Invoice from '../../models/Invoice';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const invoice = await Invoice.find({})
      .sort({ date: -1 })
      .limit(5)
      .populate('customer_id', 'name email image_url');

    if (invoice.length === 0) {
      console.log('No data found in Invoice collection.');
    }
    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}
