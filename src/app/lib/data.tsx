export const getRevenue = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/Revenue', {
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
    const res = await fetch('http://localhost:3000/api/Invoices', {
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
    const res = await fetch('http://localhost:3000/api/Cards', {
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
