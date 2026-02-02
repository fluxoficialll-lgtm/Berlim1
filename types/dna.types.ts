/**
 * User DNA - 72 Dimensões Humanas Mensuráveis
 * Cada valor representa uma escala de 0 a 100 (ou 0 a 1000 para maior precisão).
 */

export interface CognitiveCore {
  rationality: number;        // 1. Racionalidade
  criticalThinking: number;   // 2. Pensamento crítico
  analyticalCapacity: number; // 3. Capacidade analítica
  cognitiveSpeed: number;     // 4. Velocidade cognitiva
  operationalMemory: number;  // 5. Memória operacional
  longTermMemory: number;     // 6. Memória de longo prazo
  abstractionCapacity: number;// 7. Capacidade de abstração
  mentalFlexibility: number;  // 8. Flexibilidade mental
  logicalConsistency: number; // 9. Consistência lógica
}

export interface InternalControl {
  selfKnowledge: number;      // 10. Autoconhecimento
  metacognition: number;      // 11. Metacognição
  emotionalControl: number;   // 12. Autocontrole emocional
  selfDiscipline: number;     // 13. Autodisciplina
  psychologicalAutonomy: number; // 14. Autonomia psicológica
  frustrationTolerance: number; // 15. Tolerância à frustração
  emotionalStability: number;  // 16. Estabilidade emocional
  mentalResilience: number;    // 17. Resiliência mental
}

export interface EmotionalCore {
  intensity: number;          // 18. Intensidade emocional
  reactivity: number;         // 19. Reatividade emocional
  cognitiveEmpathy: number;   // 20. Empatia cognitiva
  emotionalEmpathy: number;   // 21. Empatia emocional
  sufferingAversion: number;  // 22. Aversão ao sofrimento
  pleasureSearch: number;     // 23. Busca por prazer (Hedonismo)
  basalFear: number;          // 24. Medo basal
  basalAnger: number;         // 25. Raiva basal
}

export interface MoralValues {
  moralRigidity: number;      // 26. Rigidez moral
  ethicalConsistency: number; // 27. Consistência ética
  instrumentalization: number;// 28. Instrumentalização do outro
  guiltCapacity: number;      // 29. Culpa
  socialShame: number;        // 30. Vergonha social
  moralPragmatism: number;    // 31. Pragmatismo moral
  harmAversion: number;       // 32. Aversão a dano
}

export interface SocialRelational {
  sociability: number;        // 33. Sociabilidade
  socialDominance: number;    // 34. Dominância social
  socialSubmission: number;   // 35. Submissão social
  assertiveness: number;      // 36. Assertividade
  communicationSkills: number;// 37. Habilidade comunicacional
  socialReading: number;      // 38. Leitura social
  belongingNeed: number;      // 39. Necessidade de pertencimento
  inclusivity: number;        // 40. Inclusividade
  interpersonalTrust: number; // 41. Confiança interpessoal
}

export interface MotivationDrive {
  intrinsicMotivation: number; // 42. Motivação intrínseca
  extrinsicMotivation: number; // 43. Motivação extrínseca
  ambition: number;            // 44. Ambição
  longTermOrientation: number; // 45. Orientação a longo prazo
  persistence: number;         // 46. Persistência
  purposeClarity: number;      // 47. Clareza de propósito
  boredomAversion: number;     // 48. Aversão ao tédio
  noveltySearch: number;       // 49. Busca por novidade
}

export interface DecisionRisk {
  riskAppetite: number;        // 50. Apetite por risco
  probabilityCalculation: number; // 51. Cálculo de probabilidade
  decisionImpulsivity: number; // 52. Impulsividade decisória
  strategicPlanning: number;   // 53. Planejamento estratégico
  prioritizationCapacity: number; // 54. Capacidade de priorização
  uncertaintyTolerance: number; // 55. Tolerância à incerteza
}

export interface EgoStructure {
  functionalSelfEsteem: number; // 56. Autoestima funcional
  illusorySelfEsteem: number;   // 57. Autoestima ilusória
  identityRigidity: number;     // 58. Rigidez identitária
  statusNeed: number;           // 59. Necessidade de status
  controlNeed: number;          // 60. Necessidade de controle
  powerNeed: number;            // 61. Necessidade de poder
  failureSensitivity: number;   // 62. Sensibilidade ao fracasso
}

export interface CreativityProduction {
  creativity: number;           // 63. Criatividade
  originality: number;          // 64. Originalidade
  executionCapacity: number;    // 65. Capacidade de execução
  sustainedFocus: number;       // 66. Foco sustentado
  fastLearning: number;         // 67. Capacidade de aprendizado rápido
  knowledgeTransfer: number;    // 68. Transferência de conhecimento
}

export interface ExistentialDimension {
  deathAcceptance: number;      // 69. Aceitação da morte
  existentialMeaning: number;   // 70. Sentido existencial
  emptinessFear: number;        // 71. Medo do vazio
  meaningNeed: number;          // 72. Necessidade de significado
}

export interface UserDNA {
  cognitive: CognitiveCore;
  internal: InternalControl;
  emotional: EmotionalCore;
  moral: MoralValues;
  social: SocialRelational;
  motivation: MotivationDrive;
  decision: DecisionRisk;
  ego: EgoStructure;
  creativity: CreativityProduction;
  existential: ExistentialDimension;
  lastUpdate: number;
}
