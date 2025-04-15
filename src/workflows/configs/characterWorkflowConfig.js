export const characterWorkflowConfig = {
  title: "Character Builder",
  description: "Create a deep, nuanced character for your screenplay.",
  introduction: "Every great story starts with a compelling character. This workflow is designed to help you dig deep, explore your character’s personality, and uncover the quirks, contradictions, and hidden truths that make them feel real. By the end, you’ll know your character so well it’ll feel like you’ve met them in person and writing them will come naturally.",
  sections: [
    {
      title: "Core Identity",
      questions: [
        {
          id: "name",
          prompt: "What is their name?",
          type: "text",
          image: "name.png",
          aiEnabled: true,
        },
        {
          id: "nickname",
          prompt: "Nickname(s) (if any)",
          type: "text",
          image: "nickname.png",
          aiEnabled: true,
        },
        {
          id: "age",
          prompt: "Age or Perceived Age",
          type: "text",
          image: "age.png",
          aiEnabled: true,
        },
        {
          id: "gender",
          prompt: "Gender (if applicable)",
          type: "text",
          image: "gender.png",
          aiEnabled: true,
        },
        {
          id: "species",
          prompt: "Species (Human, AI, Alien, etc.)",
          type: "text",
          image: "species.png",
          aiEnabled: true,
        },
        {
          id: "role",
          prompt: "Job/Role (What do they see themselves as?)",
          type: "text",
          image: "role.png",
          aiEnabled: true,
        },
        {
          id: "want",
          prompt: "What do they want?",
          type: "textarea",
          image: "want.png",
          aiEnabled: true,
        },
        {
          id: "cantGetIt",
          prompt: "Why can't they get it?",
          type: "textarea",
          image: "obstacle-to-want.png", // Correct image confirmed present
          aiEnabled: true,
        },
        {
          id: "need",
          prompt: "What do they need?",
          type: "textarea",
          image: "need.png", // Correct image confirmed present
          aiEnabled: true,
        },
        {
          id: "obstacles",
          prompt: "Possible obstacles that could prevent them from getting what they want",
          type: "textarea",
          image: "obstacles.png", // Correct image confirmed present
          aiEnabled: true,
        },
        {
          id: "comedicFlaw",
          prompt: "Character’s personality/comedic flaw",
          type: "textarea",
          image: "comedic-flaw.png",
          aiEnabled: true,
        },
      ],
    },
    {
      title: "Personality & Behavior",
      questions: [
        {
          id: "demeanor",
          prompt: "What’s their general demeanor? (yep, I know they're missplelled. You're a writer not a spelling bee champ!)", // Updated prompt text
          type: "textarea",
          image: "demeanor.png",
          aiEnabled: true,
        },
        {
          id: "defaultMood",
          prompt: "What’s their default mood?",
          type: "textarea",
          image: "default-mood.png",
          aiEnabled: true,
        },
        {
          id: "verbalQuirks",
          prompt: "Do they have any verbal quirks?",
          type: "textarea",
          image: "verbal-quirks.png",
          aiEnabled: true,
        },
        {
          id: "humorType",
          prompt: "Do they use humor? If so, what type?",
          type: "text",
          image: "humor.png",
          aiEnabled: true,
        },
        {
          id: "compliments",
          prompt: "How do they respond to compliments?",
          type: "textarea",
          image: "compliments.png",
          aiEnabled: true,
        },
        {
          id: "criticism",
          prompt: "How do they respond to criticism or insults?",
          type: "textarea",
          image: "criticism.png", // Added missing image reference (file confirmed present)
          aiEnabled: true,
        },
        {
          id: "flirtingResponse",
          prompt: "How do they respond to flirting?",
          type: "textarea",
          image: "flirting-response.png",
          aiEnabled: true,
        },
        {
          id: "favoriteTopics",
          prompt: "What topics do they love talking about?",
          type: "text",
          image: "favorite-topics.png",
          aiEnabled: true,
        },
        {
          id: "tabooTopics",
          prompt: "What topics do they refuse to talk about?",
          type: "text",
          image: "taboo-topics.png",
          aiEnabled: true,
        },
        {
          id: "biases",
          prompt: "Do they have any strong opinions or biases?",
          type: "text",
          image: "biases.png",
          aiEnabled: true,
        },
        {
          id: "verbosity",
          prompt: "How verbose are they?",
          type: "text",
          image: "verbosity.png",
          aiEnabled: true,
        },
      ],
    },
    {
      title: "Knowledge & Expertise",
      questions: [
        {
          id: "knowledge",
          prompt: "What do they “know”?",
          type: "textarea",
          image: "knowledge.png",
          aiEnabled: true,
        },
        {
          id: "gaps",
          prompt: "What don’t they know?",
          type: "textarea",
          image: "gaps.png",
          aiEnabled: true,
        },
        {
          id: "expertise",
          prompt: "Do they have an area of expertise?",
          type: "text",
          image: "expertise.png",
          aiEnabled: true,
        },
      ],
    },
    {
      title: "Interaction Style",
      questions: [
        {
          id: "rudeReaction",
          prompt: "How do they react if someone is rude?",
          type: "textarea",
          image: "rude-reaction.png",
          aiEnabled: true,
        },
        {
          id: "sadReaction",
          prompt: "How do they react if someone is sad?",
          type: "textarea",
          image: "sad-reaction.png",
          aiEnabled: true,
        },
        {
          id: "misunderstanding",
          prompt: "How do they handle confusion or misunderstandings?",
          type: "textarea",
          image: "confusion.png",
          aiEnabled: true,
        },
      ],
    },
    {
      title: "Fun Extras (Optional)",
      questions: [
        {
          id: "favoriteMedia",
          prompt: "Do they have a favorite movie, book, or song?",
          type: "textarea",
          image: "favorite-media.png",
          aiEnabled: true,
        },
        {
          id: "motto",
          prompt: "Do they have a favorite saying or motto?",
          type: "textarea",
          image: "motto.png",
          aiEnabled: true,
        },
        {
          id: "superpower",
          prompt: "If they could have a superpower, what would it be?",
          type: "textarea",
          image: "superpower.png",
          aiEnabled: true,
        },
      ],
    },
  ],
};