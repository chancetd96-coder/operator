import type { Mission } from "@/lib/types/mission";

function addDays(
  value: Date,
  days: number,
): string {
  const result = new Date(value);

  result.setDate(result.getDate() + days);

  return result.toISOString().slice(0, 10);
}

function addHours(
  value: Date,
  hours: number,
): string {
  const result = new Date(value);

  result.setHours(result.getHours() + hours);

  return result.toISOString();
}

export function buildDemoEnvironment(): Mission[] {
  const now = new Date();
  const createdAt = addHours(now, -72);
  const updatedAt = now.toISOString();

  const investorReadiness: Mission = {
    id: "demo-investor-readiness",
    title: "Investor Demonstration Readiness",
    objective:
      "Deliver a clear and credible Operator demonstration that proves the mission-execution thesis.",
    summary:
      "Prepare the public narrative, live product environment, demonstration flow, and follow-up package for the upcoming investor briefing.",
    prompt:
      "Prepare Operator for a high-confidence investor demonstration.",
    assumptions: [
      "The audience has limited prior exposure to Operator.",
      "The demonstration must explain the product before showing detailed workflows.",
      "The live environment must remain stable and repeatable.",
    ],
    schedule: [
      "Complete product hardening",
      "Run technical rehearsal",
      "Conduct investor briefing",
      "Send follow-up package",
    ],
    resources: [
      "Operator MVP",
      "Public product site",
      "Demo script",
      "Investor briefing materials",
    ],
    successMetrics: [
      "Audience understands Operator in under two minutes.",
      "The live demonstration completes without interruption.",
      "Follow-up meeting or diligence request is secured.",
    ],
    status: "active",
    priority: "Critical",
    progress: 82,
    executionScore: 71,
    owner: "Chance",
    recommendation:
      "Complete the deterministic demo environment before the final investor rehearsal.",
    tasks: [
      {
        id: "demo-investor-polish-site",
        title: "Polish the public Operator experience",
        description:
          "Complete the responsive and navigation audit for the public-facing site.",
        status: "Complete",
        owner: "Chance",
        dueDate: addDays(now, -1),
        scheduledDate: addDays(now, -3),
        progress: 100,
        comments: [
          "Public narrative and product preview are complete.",
        ],
        blockers: [],
        risks: [],
        meetingIds: [],
      },
      {
        id: "demo-investor-lifecycle",
        title: "Complete mission lifecycle controls",
        description:
          "Validate complete, archive, retention, and historical-access behavior.",
        status: "Complete",
        owner: "Chance",
        dueDate: addDays(now, 0),
        scheduledDate: addDays(now, -1),
        progress: 100,
        comments: [
          "Completion and one-year archive retention are implemented.",
        ],
        blockers: [],
        risks: [],
        meetingIds: [],
      },
      {
        id: "demo-investor-environment",
        title: "Build the deterministic demo environment",
        description:
          "Create a repeatable portfolio that consistently populates Commander Brief and Mission Control.",
        status: "In Progress",
        owner: "Chance",
        dueDate: addDays(now, 0),
        scheduledDate: addDays(now, 0),
        progress: 70,
        comments: [
          "Three connected missions will anchor the demonstration.",
        ],
        blockers: [
          "Demo environment has not completed final validation.",
        ],
        risks: [],
        meetingIds: ["demo-investor-rehearsal"],
      },
      {
        id: "demo-investor-rehearsal-task",
        title: "Rehearse the investor demonstration",
        description:
          "Run the five-minute walkthrough and tighten transitions between the public site and Mission Control.",
        status: "Not Started",
        owner: "Chance",
        dueDate: addDays(now, 1),
        scheduledDate: addDays(now, 1),
        progress: 0,
        comments: [],
        blockers: [],
        risks: [
          "The demonstration may exceed the available briefing window.",
        ],
        meetingIds: ["demo-investor-rehearsal"],
      },
      {
        id: "demo-investor-follow-up",
        title: "Prepare the investor follow-up package",
        description:
          "Prepare the concise follow-up note, roadmap, access links, and supporting materials.",
        status: "Not Started",
        owner: "Chance",
        dueDate: addDays(now, 2),
        scheduledDate: addDays(now, 2),
        progress: 0,
        comments: [],
        blockers: [],
        risks: [],
        meetingIds: [],
      },
    ],
    risks: [
      {
        id: "demo-investor-risk-narrative",
        title: "Product narrative becomes too broad",
        description:
          "The demonstration may dilute the core mission-execution wedge.",
        mitigation:
          "Keep the walkthrough centered on intent, execution, command attention, and lifecycle.",
        taskIds: [
          "demo-investor-rehearsal-task",
        ],
        resolved: false,
      },
      {
        id: "demo-investor-risk-mobile",
        title: "Mobile layout regression",
        description:
          "A small-screen presentation may compress the product preview.",
        mitigation:
          "Use Vercel mobile validation and preserve direct Mission Control access.",
        taskIds: [
          "demo-investor-polish-site",
        ],
        resolved: false,
      },
    ],
    meetings: [
      {
        id: "demo-investor-rehearsal",
        title: "Investor Demonstration Rehearsal",
        date: addDays(now, 1),
        time: "10:00",
        notes:
          "Run the complete demonstration, test transitions, and capture final adjustments.",
        taskIds: [
          "demo-investor-environment",
          "demo-investor-rehearsal-task",
        ],
      },
      {
        id: "demo-investor-briefing",
        title: "Investor Briefing",
        date: addDays(now, 2),
        time: "14:00",
        notes:
          "Demonstrate Operator's mission-execution workflow and long-term platform thesis.",
        taskIds: [
          "demo-investor-follow-up",
        ],
      },
    ],
    createdAt,
    updatedAt,
    startedAt: createdAt,
    color: "cyan",
    icon: "target",
  };

  const connectedWarfareDeployment: Mission = {
    id: "demo-connected-warfare",
    title: "Connected Warfare Deployment",
    objective:
      "Prepare and execute a controlled deployment of a connected-warfare capability to an operational customer.",
    summary:
      "Synchronize technical readiness, training, logistics, customer coordination, and deployment risk across the mission team.",
    prompt:
      "Prepare a connected-warfare capability for operational deployment.",
    assumptions: [
      "The capability has completed initial engineering validation.",
      "Customer personnel require training before field employment.",
      "Interoperability testing remains the primary technical risk.",
    ],
    schedule: [
      "Technical readiness review",
      "Customer training",
      "Deployment rehearsal",
      "Operational handoff",
    ],
    resources: [
      "Mission operations team",
      "Field engineers",
      "Customer training team",
      "Deployment equipment",
    ],
    successMetrics: [
      "All critical interfaces pass validation.",
      "Customer team completes training.",
      "Deployment rehearsal closes without a critical finding.",
    ],
    status: "active",
    priority: "High",
    progress: 54,
    executionScore: 49,
    owner: "Mission Operations",
    recommendation:
      "Resolve the interoperability risk before the deployment rehearsal.",
    tasks: [
      {
        id: "demo-warfare-config",
        title: "Finalize deployment configuration",
        description:
          "Lock the field configuration and document the approved baseline.",
        status: "Complete",
        owner: "Systems Engineering",
        dueDate: addDays(now, -2),
        scheduledDate: addDays(now, -4),
        progress: 100,
        comments: [],
        blockers: [],
        risks: [],
        meetingIds: [],
      },
      {
        id: "demo-warfare-integration",
        title: "Complete interoperability testing",
        description:
          "Validate data exchange with the customer's existing operational systems.",
        status: "Blocked",
        owner: "Integration Team",
        dueDate: addDays(now, 1),
        scheduledDate: addDays(now, 0),
        progress: 45,
        comments: [
          "Awaiting customer interface credentials.",
        ],
        blockers: [
          "Customer interface credentials are not available.",
        ],
        risks: [
          "Late validation may compress the rehearsal window.",
        ],
        meetingIds: ["demo-warfare-sync"],
      },
      {
        id: "demo-warfare-training",
        title: "Deliver customer operator training",
        description:
          "Train the designated customer team on standard workflows and degraded operations.",
        status: "In Progress",
        owner: "Training Team",
        dueDate: addDays(now, 2),
        scheduledDate: addDays(now, 1),
        progress: 60,
        comments: [],
        blockers: [],
        risks: [],
        meetingIds: ["demo-warfare-training-sync"],
      },
      {
        id: "demo-warfare-rehearsal",
        title: "Conduct deployment rehearsal",
        description:
          "Run the complete mission sequence under realistic field conditions.",
        status: "Not Started",
        owner: "Mission Operations",
        dueDate: addDays(now, 4),
        scheduledDate: addDays(now, 3),
        progress: 0,
        comments: [],
        blockers: [],
        risks: [],
        meetingIds: ["demo-warfare-rehearsal-review"],
      },
    ],
    risks: [
      {
        id: "demo-warfare-risk-interface",
        title: "Customer interoperability remains unverified",
        description:
          "The deployment cannot proceed confidently without validated data exchange.",
        mitigation:
          "Escalate credential release and maintain a fallback isolated configuration.",
        taskIds: [
          "demo-warfare-integration",
        ],
        resolved: false,
      },
      {
        id: "demo-warfare-risk-training",
        title: "Training window may be compressed",
        description:
          "Late technical changes could reduce customer training time.",
        mitigation:
          "Protect the training baseline and separate optional advanced content.",
        taskIds: [
          "demo-warfare-training",
        ],
        resolved: false,
      },
    ],
    meetings: [
      {
        id: "demo-warfare-sync",
        title: "Interoperability Resolution Sync",
        date: addDays(now, 0),
        time: "15:00",
        notes:
          "Resolve credentials, owners, and the final validation window.",
        taskIds: [
          "demo-warfare-integration",
        ],
      },
      {
        id: "demo-warfare-training-sync",
        title: "Customer Training Coordination",
        date: addDays(now, 1),
        time: "09:00",
        notes:
          "Confirm attendees, equipment, training objectives, and contingencies.",
        taskIds: [
          "demo-warfare-training",
        ],
      },
      {
        id: "demo-warfare-rehearsal-review",
        title: "Deployment Rehearsal Review",
        date: addDays(now, 4),
        time: "16:00",
        notes:
          "Review execution, findings, and the recommendation to proceed.",
        taskIds: [
          "demo-warfare-rehearsal",
        ],
      },
    ],
    createdAt: addHours(now, -120),
    updatedAt,
    startedAt: addHours(now, -120),
    color: "amber",
    icon: "network",
  };

  const customerImplementation: Mission = {
    id: "demo-customer-implementation",
    title: "Enterprise Customer Implementation",
    objective:
      "Deploy Operator into a customer operations team and achieve an effective initial operating capability.",
    summary:
      "Align stakeholders, configure the mission model, train users, and transition the customer into sustained execution.",
    prompt:
      "Implement Operator for an enterprise operations customer.",
    assumptions: [
      "The customer has an executive sponsor.",
      "Initial adoption will begin with one operations team.",
      "Existing workflows will remain in place during transition.",
    ],
    schedule: [
      "Stakeholder alignment",
      "Workflow configuration",
      "User training",
      "Initial operating capability",
    ],
    resources: [
      "Customer success lead",
      "Implementation engineer",
      "Executive sponsor",
      "Customer operations team",
    ],
    successMetrics: [
      "The initial team adopts Operator for daily execution.",
      "Leadership receives a reliable operational picture.",
      "Manual status reporting decreases.",
    ],
    status: "planning",
    priority: "Normal",
    progress: 31,
    executionScore: 58,
    owner: "Customer Success",
    recommendation:
      "Complete stakeholder alignment before locking the implementation design.",
    tasks: [
      {
        id: "demo-customer-discovery",
        title: "Complete operational discovery",
        description:
          "Document current workflows, reporting friction, decision points, and operational priorities.",
        status: "Complete",
        owner: "Customer Success",
        dueDate: addDays(now, -1),
        scheduledDate: addDays(now, -3),
        progress: 100,
        comments: [],
        blockers: [],
        risks: [],
        meetingIds: [],
      },
      {
        id: "demo-customer-alignment",
        title: "Align executive and operational stakeholders",
        description:
          "Confirm objectives, scope, ownership, implementation boundaries, and success criteria.",
        status: "In Progress",
        owner: "Customer Success",
        dueDate: addDays(now, 1),
        scheduledDate: addDays(now, 0),
        progress: 55,
        comments: [
          "Operations lead is aligned; executive confirmation remains pending.",
        ],
        blockers: [],
        risks: [
          "Delayed sponsor confirmation may shift implementation sequencing.",
        ],
        meetingIds: ["demo-customer-steering"],
      },
      {
        id: "demo-customer-config",
        title: "Configure the customer mission workspace",
        description:
          "Translate the customer's operating model into missions, ownership, risks, meetings, and timelines.",
        status: "Not Started",
        owner: "Implementation Engineering",
        dueDate: addDays(now, 3),
        scheduledDate: addDays(now, 2),
        progress: 0,
        comments: [],
        blockers: [],
        risks: [],
        meetingIds: ["demo-customer-design"],
      },
      {
        id: "demo-customer-training",
        title: "Train the initial operations team",
        description:
          "Prepare the team to use Commander, Timeline, Capture, Focus, and mission lifecycle workflows.",
        status: "Not Started",
        owner: "Customer Success",
        dueDate: addDays(now, 5),
        scheduledDate: addDays(now, 4),
        progress: 0,
        comments: [],
        blockers: [],
        risks: [],
        meetingIds: [],
      },
    ],
    risks: [
      {
        id: "demo-customer-risk-sponsor",
        title: "Executive sponsorship is not fully confirmed",
        description:
          "Implementation may lose priority without explicit senior-leader support.",
        mitigation:
          "Secure a written sponsor decision during the steering session.",
        taskIds: [
          "demo-customer-alignment",
        ],
        resolved: false,
      },
    ],
    meetings: [
      {
        id: "demo-customer-steering",
        title: "Customer Steering Session",
        date: addDays(now, 1),
        time: "13:00",
        notes:
          "Confirm objectives, scope, sponsorship, and initial operating capability.",
        taskIds: [
          "demo-customer-alignment",
        ],
      },
      {
        id: "demo-customer-design",
        title: "Implementation Design Review",
        date: addDays(now, 2),
        time: "11:00",
        notes:
          "Review the configured operating model and approve the implementation baseline.",
        taskIds: [
          "demo-customer-config",
        ],
      },
    ],
    createdAt: addHours(now, -48),
    updatedAt,
    startedAt: addHours(now, -48),
    color: "violet",
    icon: "building",
  };

  return [
    investorReadiness,
    connectedWarfareDeployment,
    customerImplementation,
  ];
}