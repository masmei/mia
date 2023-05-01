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

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Brainstorm 6 original marketing campaigns for ${companyName}, ${companyDescription}. Let your imagination run wild. Provide as much detail as possible and a creative brief for each campaign.

Product: ${productDescription}
Target Audience: ${targetAudience}

Campaigns:`,
      temperature: 0.6,
      max_tokens: 2000,
      n: 1,
      stop: null,
    });

    console.log(completion.data.choices[0].text.trim());
    res.status(200).json({ result: completion.data.choices[0].text.trim() });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
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
