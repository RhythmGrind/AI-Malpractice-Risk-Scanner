from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.risk_agent import risk_agent


def create_risk_assessment_workflow():
    """Create the LangGraph workflow for risk assessment."""

    # Create state graph
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("extract_info", risk_agent.extract_patient_info)
    workflow.add_node("find_cases", risk_agent.find_similar_cases)
    workflow.add_node("identify_risks", risk_agent.identify_risks)
    workflow.add_node("calculate_score", risk_agent.calculate_risk_score)
    workflow.add_node("generate_mitigation", risk_agent.generate_mitigation)

    # Define edges (workflow sequence)
    workflow.set_entry_point("extract_info")
    workflow.add_edge("extract_info", "find_cases")
    workflow.add_edge("find_cases", "identify_risks")
    workflow.add_edge("identify_risks", "calculate_score")
    workflow.add_edge("calculate_score", "generate_mitigation")
    workflow.add_edge("generate_mitigation", END)

    # Compile the graph
    app = workflow.compile()

    return app


# Create workflow instance
risk_assessment_app = create_risk_assessment_workflow()
