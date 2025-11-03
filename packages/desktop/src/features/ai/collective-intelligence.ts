// Electron API types - defined in src/types/electron.d.ts

export interface AIAgent {
  id: string;
  personality: string;
  role: string;
  response?: string;
  status: 'idle' | 'thinking' | 'done';
}

export interface CollectiveSession {
  id: string;
  question: string;
  agents: AIAgent[];
  consensus?: string;
  startTime: Date;
  endTime?: Date;
}

export class CollectiveIntelligence {
  private sessions: Map<string, CollectiveSession> = new Map();

  async runCollectiveAnalysis(
    question: string,
    onAgentUpdate: (agent: AIAgent) => void,
    onComplete: (consensus: string) => void
  ): Promise<void> {
    const sessionId = `session-${Date.now()}`;

    const agents: AIAgent[] = [
      { id: 'alex', personality: 'alex', role: 'معماري', status: 'idle' },
      { id: 'sarah', personality: 'sarah', role: 'مطورة', status: 'idle' },
      { id: 'mike', personality: 'mike', role: 'مراجع', status: 'idle' },
      { id: 'guardian', personality: 'guardian', role: 'أمن', status: 'idle' },
      { id: 'olivia', personality: 'olivia', role: 'اختبارات', status: 'idle' },
      { id: 'tom', personality: 'tom', role: 'تحسين', status: 'idle' },
    ];

    const session: CollectiveSession = {
      id: sessionId,
      question,
      agents,
      startTime: new Date(),
    };

    this.sessions.set(sessionId, session);

    for (const agent of agents) {
      agent.status = 'thinking';
      onAgentUpdate(agent);

      try {
        const prompt = `${question}

أجب من منظورك كـ ${agent.role}.`;

        const result = await window.electron.ipcRenderer.invoke(
          'ai:call',
          prompt,
          agent.personality
        );

        if (result.success) {
          agent.response = result.response;
          agent.status = 'done';
          onAgentUpdate(agent);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error(`Agent ${agent.id} failed:`, error);
        agent.status = 'idle';
        onAgentUpdate(agent);
      }
    }

    const consensus = await this.generateConsensus(session);
    session.consensus = consensus;
    session.endTime = new Date();

    onComplete(consensus);
  }

  private async generateConsensus(session: CollectiveSession): Promise<string> {
    const agentResponses = session.agents
      .filter((a) => a.response)
      .map((a) => `### ${a.role} (${a.personality}):\n${a.response}`)
      .join('\n\n');

    const prompt = `لديك آراء متعددة من خبراء مختلفين حول السؤال التالي:

**السؤال:**
${session.question}

**الآراء:**
${agentResponses}

مهمتك: استخلص إجماع موحد يجمع أفضل النقاط من كل رأي، مع حل أي تناقضات.`;

    const result = await window.electron.ipcRenderer.invoke('ai:call', prompt, 'alex');

    if (result.success) {
      return result.response;
    } else {
      throw new Error('Failed to generate consensus');
    }
  }

  getSession(sessionId: string): CollectiveSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): CollectiveSession[] {
    return Array.from(this.sessions.values());
  }
}
