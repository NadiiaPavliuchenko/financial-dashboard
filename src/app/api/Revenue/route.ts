import { connectToDatabase } from '../db';
import Revenue from '../../models/Revenue';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const revenue = await Revenue.find();
    if (revenue.length === 0) {
      console.log('No data found in Revenue collection.');
    }

    return NextResponse.json(revenue, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}

// export async function fetchCustomers() {
//   try {
//     const customers = await Customer.find({}).sort({ name: 1 }).exec();
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all customers.');
//   }
// }

// export async function fetchFilteredCustomers(query: string) {
//   try {
//     const customers = await Customer.aggregate([
//       {
//         $match: {
//           $or: [
//             { name: { $regex: query, $options: 'i' } },
//             { email: { $regex: query, $options: 'i' } },
//           ],
//         },
//       },
//       {
//         $lookup: {
//           from: 'invoices',
//           localField: '_id',
//           foreignField: 'customer_id',
//           as: 'invoices',
//         },
//       },
//       {
//         $project: {
//           name: 1,
//           email: 1,
//           image_url: 1,
//           total_invoices: { $size: '$invoices' },
//           total_pending: {
//             $sum: {
//               $cond: [
//                 { $eq: ['$invoices.status', 'pending'] },
//                 '$invoices.amount',
//                 0,
//               ],
//             },
//           },
//           total_paid: {
//             $sum: {
//               $cond: [
//                 { $eq: ['$invoices.status', 'paid'] },
//                 '$invoices.amount',
//                 0,
//               ],
//             },
//           },
//         },
//       },
//     ]);

//     return customers.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }
