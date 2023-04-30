import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const { companyName, companyDescription, productDescription, targetAudience } = req.body;

  if (!companyName || !companyDescription || !productDescription || !targetAudience) {
    res.status(400).json({
      error: {
        message: "Please provide all required fields",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(companyName, companyDescription, productDescription, targetAudience),
      temperature: 0.7,
      max_tokens: 3000,
    });
    res.status(200).json({ result: completion.data.choices[0].text});
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}

function generatePrompt(companyName, companyDescription, productDescription, targetAudience) {
  return `Brainstorm 6 original marketing campaigns for ${companyName}, ${companyDescription}. Let your imagination run wild. Provide as much detail as possible and a creative brief.

PRODUCT DESCRIPTION: ${productDescription}

TARGET AUDIENCE: ${targetAudience}`;
}
