import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const missionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
    },
    summary: {
      type: "string",
    },
    assumptions: {
      type: "array",
      items: { type: "string" },
    },
    tasks: {
      type: "array",
      items: { type: "string" },
    },
    schedule: {
      type: "array",
      items: { type: "string" },
    },
    meetings: {
      type: "array",
      items: { type: "string" },
    },
    risks: {
      type: "array",
      items: { type: "string" },
    },
    resources: {
      type: "array",
      items: { type: "string" },
    },
    successMetrics: {
      type: "array",
      items: { type: "string" },
    },
    recommendation: {
      type: "string",
    },
    priority: {
     type: "string",
     enum: ["Critical", "High", "Normal", "Low"],
     },
  },
  required: [
    "title",
    "summary",
    "priority",
    "assumptions",
    "tasks",
    "schedule",
    "meetings",
    "risks",
    "resources",
    "successMetrics",
    "recommendation",
  ],
};

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 },
      );
    }

    const body = await req.json();

    const mission =
      typeof body.mission === "string" ? body.mission.trim() : "";

    if (mission.length < 5) {
      return Response.json(
        { error: "Mission must be at least 5 characters." },
        { status: 400 },
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.5",
      reasoning: {
        effort: "medium",
      },
      input: [
        {
          role: "system",
          content: `
You are Operator, an elite AI Chief of Staff.

Turn the user's goal into a specific, executable mission plan.

Think like:
- a military operations planner
- a startup COO
- a project manager
- a brutally practical advisor

- Assign priority using:
  - Critical: immediate, high-consequence, or deadline-driven
  - High: strategically important and should be worked soon
  - Normal: meaningful but not urgent
  - Low: optional, exploratory, or low consequence

Rules:
- Do not provide generic motivation.
- Be concise, specific, and action-oriented.
- Make reasonable assumptions when details are missing.
- Tasks must be concrete actions.
- Schedule entries must include a timeframe.
- Risks must describe an actual threat, dependency, or blocker.
- Meetings should only be included when coordination is useful.
- The recommendation must identify the highest-leverage next move.
          `,
        },
        {
          role: "user",
          content: mission,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "operator_mission_plan",
          strict: true,
          schema: missionSchema,
        },
      },
    });

    if (!response.output_text) {
      throw new Error("The model returned no mission plan.");
    }

    const plan = JSON.parse(response.output_text);

    return Response.json({ plan });
  } catch (error) {
  console.error("Operator generation error:", error);

  const message =
    error instanceof Error
      ? error.message
      : "Unknown generation error";

  return Response.json(
    {
      error: "Operator failed to generate a mission plan.",
      details: message,
    },
    { status: 500 },
  );
}
}