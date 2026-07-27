import type {
  OperatorEntityRef,
  OperatorEventTime,
} from "@/lib/types/operator-event";

type ExtractionResult = {
  people: OperatorEntityRef[];
  organizations: OperatorEntityRef[];
  time?: OperatorEventTime;
};

const DAYS =
  /\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;

const TIMES =
  /\b(\d{1,2}:\d{2}|\d{3,4}|morning|afternoon|evening|noon|midnight)\b/i;

function extractTime(statement: string): OperatorEventTime | undefined {
  const dayMatch = statement.match(DAYS);
  const timeMatches = [...statement.matchAll(new RegExp(TIMES, "gi"))];

  if (!dayMatch && timeMatches.length === 0) {
    return undefined;
  }

  return {
    raw: [dayMatch?.[0], ...timeMatches.map((match) => match[0])]
      .filter(Boolean)
      .join(" "),
  };
}

function extractPeople(statement: string): OperatorEntityRef[] {
  const patterns = [
    /\bcall\s+([A-Z][a-z]+)/,
    /\bemail\s+([A-Z][a-z]+)/,
    /\btext\s+([A-Z][a-z]+)/,
    /\bcontact\s+([A-Z][a-z]+)/,
    /\bwith\s+([A-Z][a-z]+)/,
  ];

  const people = new Set<string>();

  for (const pattern of patterns) {
    const match = statement.match(pattern);

    if (match?.[1]) {
      people.add(match[1]);
    }
  }

  return [...people].map((name) => ({ name }));
}

function extractOrganizations(
  statement: string,
): OperatorEntityRef[] {
  const organizations = new Set<string>();

  const atPattern = /\bat\s+([A-Z][A-Za-z0-9 &-]+)/;
  const match = statement.match(atPattern);

  if (match?.[1]) {
    organizations.add(match[1].trim());
  }

  return [...organizations].map((name) => ({ name }));
}

export function extractEntities(
  statement: string,
): ExtractionResult {
  return {
    people: extractPeople(statement),
    organizations: extractOrganizations(statement),
    time: extractTime(statement),
  };
}
