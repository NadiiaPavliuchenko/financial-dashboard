import { connectToDatabase } from '../api/db';
import Invoice from '../models/Invoice';

const BASE_URL = 'http://localhost:3000';
// https://financial-dashboard-ebon.vercel.app

export const getRevenue = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/Revenue`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch topics');
    }

    return res.json();
  } catch (error) {
    console.log('Error loading topics: ', error);
  }
};

export const fetchLatestInvoices = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/Invoices`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch topics');
    }

    return res.json();
  } catch (error) {
    console.log('Error loading topics: ', error);
  }
};

export const fetchCardsData = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/Cards`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch topics');
    }

    return res.json();
  } catch (error) {
    console.log('Error loading topics: ', error);
  }
};

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    await connectToDatabase();
    const invoices = await Invoice.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'customer_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $unwind: '$customer',
      },
      {
        $match: {
          $or: [
            { 'customer.name': { $regex: query, $options: 'i' } },
            { 'customer.email': { $regex: query, $options: 'i' } },
            {
              $expr: {
                $regexMatch: {
                  input: { $toString: '$amount' },
                  regex: query,
                  options: 'i',
                },
              },
            },
            {
              $expr: {
                $regexMatch: {
                  input: { $toString: '$date' },
                  regex: query,
                  options: 'i',
                },
              },
            },
            { status: { $regex: query, $options: 'i' } },
          ],
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $skip: offset,
      },
      {
        $limit: ITEMS_PER_PAGE,
      },
    ]);

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}
