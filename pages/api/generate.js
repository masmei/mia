// Import the necessary modules from OpenAI
import { Configuration, OpenAIApi } from "openai";

// Log the API key for OpenAI (should be configured in your environment variables)
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

// Create a new OpenAI configuration with your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a new instance of the OpenAI API
const openai = new OpenAIApi(configuration);

// Export a default asynchronous function to handle requests and responses
export default async function (req, res) {
  // If the API key is not configured, send an error response
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  // Extract the required information from the request body
  const { companyName, companyDescription, productDescription, targetAudience } = req.body;

  // If any required information is missing, send an error response
  if (!companyName || !companyDescription || !productDescription || !targetAudience) {
    res.status(400).json({
      error: {
        message: "Please provide all required information",
      }
    });
    return;
  }

  try {
    // Call the OpenAI API to generate a completion based on the given prompt
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(companyName, companyDescription, productDescription, targetAudience),
      temperature: 1,
      max_tokens: 300,
    });

    // Send the generated completion as the response
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // If there is an error with the API request, log it and send an error response
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

// Function to generate the prompt for the OpenAI API
function generatePrompt(companyName, companyDescription, productDescription, targetAudience) {
  return `Brainstorm an original marketing campaign ideas for ${companyName}, an ${companyDescription}. Let your imagination run wild. Provide as much detail as possible and a creative brief.

  PRODUCT DESCRIPTION: ${productDescription}.
  
  TARGET AUDIENCE: ${targetAudience}.
 `;
}
