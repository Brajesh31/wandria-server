const prompt = (duration, country, interests, travelStyles, groupTypes) => {
  return `Generate a ${duration}-day travel itinerary for ${country} based on the following user information:
            Interests: '${interests}'
            TravelStyle: '${travelStyles}'
            GroupType: '${groupTypes}'
            Return the itinerary in a clean, non-markdown JSON format with the following structure:
            {
            "title": "A descriptive title for the trip",
            "description": "A brief description of the trip and its highlights not exceeding 100 words",
            "duration": ${duration} days,
            "travelStyles": "${travelStyles}",
            "country": "${country}",
            "interests": ${interests},
            "groupTypes": "${groupTypes}",
            "bestTimeToVisit": [
              '🌸 Season (from month to month): reason to visit',
              '☀️ Season (from month to month): reason to visit',
              '🍁 Season (from month to month): reason to visit',
              '❄️ Season (from month to month): reason to visit'
            ],
            "location": {
              "city": "name of the city or region",
              "coordinates": [latitude, longitude]
            },
            "itinerary": [
            {
              "day": 1,
              "location": "City/Region Name",
              "activities": [
                {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
                {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
                {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
              ]
            },
            ...
            ]
        }`;
};

module.exports = prompt