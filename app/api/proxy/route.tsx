import { log } from 'console';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { resource_id } = req.query;

  if (!resource_id) {
    return res.status(400).json({ error: 'Resource ID is required' });
  }

  try {
    const response = await fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=${resource_id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched data:', data);

    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).json({ error: 'Failed to fetch data from API' });
  }
}
