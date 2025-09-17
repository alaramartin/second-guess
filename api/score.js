// idea: add api calls to evaluate how funny/silly the first guess was

// note: need a free ai api to call. use gemini, free (with low rate limit, but we don't need much)
//      which one should i use? 2.5 pro, flash, flash-lite all have free tiers

/* prompt

This is a trivia game, where points are based on the humor of the answer given rather than the correctness.
The humor (funnyness or sillyness) of a response will be rated on a scale of 1-5, where 1 is not funny at all and 5 is the funniest.

... give examples...

Respond with JUST A NUMBER. For example, "5" or "1". Nothing more, nothing less.
*/

import express, { request } from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// todo: instead of putting it in main make it a function that takes the fetch call in as an input
//      req, res
// async function getScore() {
//     const response = await ai.models.generateContent({
//         // ratelimited, but free tier
//         model: "gemini-2.5-flash-lite",
//         // add the guess and question here
//         contents: "hi gemini"
//     });
//     console.log(response.text);
//     return response.text;
// }

app.post("/api/score", async (request, response) => {
    const { question, guess } = request.body;
    console.log(question, guess, "hi");
    console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
    // todo: write prompt
    const prompt = "hi gemini";
    try {
        console.log("about to call");
        const aiResponse = await ai.models.generateContent({
            // ratelimited, but free tier
            model: "gemini-2.5-flash-lite",
            contents: prompt
        });
        const score = aiResponse.text.toString();
        console.log(score);
        // if (!(score.length > 1 && /^\d+$/.test(score))) {
        //     console.log("WRONG OUTPUT", score);
        //     response.status(500).json({ error : "model output"});
        // }
        // else {
        //     response.json({ score });
        // }
        response.json({ score : score});
    }
    catch (err) {
        console.log(err);
        response.status(500).json({ error : err.message });
    }
});

app.listen(3000, () => console.log("port 3000 listening"));