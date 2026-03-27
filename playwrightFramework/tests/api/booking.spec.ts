import { test, expect } from '@playwright/test';
import { ApiHelper }    from '../../utils/ApiHelper';
import { Logger }       from '../../utils/Logger';
import { getEnvConfig } from '../../config/envConfig';

/**
 * Auth API Tests — Login, token validation
 */

test('auth + create + update booking', async ({ request }) => {
  // Step 1: Get token
  const authResponse = await request.post('https://restful-booker.herokuapp.com/auth', {
    data: { username: "admin", password: "password123" },
    headers: { 'Content-Type': 'application/json' }
  });
  const authData = await authResponse.json();
   console.log("Auth Response:",authData );
  const token = authData.token;
  console.log("Auth Token:", token);

  // Step 2: Create booking
  const bookingResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
    data: {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: { checkin: "2018-01-01", checkout: "2019-01-01" },
      additionalneeds: "Breakfast"
    },
    headers: { 'Content-Type': 'application/json' }
  });

  const bookingData = await bookingResponse.json();
  const bookingId = bookingData.bookingid;
  console.log("Post Booking Data:", bookingData);
  console.log("Booking ID:", bookingId);

  // Step 3: Update booking (requires token)
  const updateResponse = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
    data: {
      firstname: "James",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: false,
      bookingdates: { checkin: "2018-01-01", checkout: "2019-01-01" },
      additionalneeds: "Lunch"
    },
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `token=${token}`
    }
  });

  console.log("Update status:", updateResponse.status());
  if (updateResponse.ok()) {
    const updatedData = await updateResponse.json();
    console.log("Updated Booking:", updatedData);
    console.log("Updated Booking Checkout", updatedData.bookingdates.checkout);
  } else {
    console.log("Update failed:", await updateResponse.text());
  }
});
