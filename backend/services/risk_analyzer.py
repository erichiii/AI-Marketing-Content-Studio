class RiskAnalyzer:
    def __init__(self):
        self.risk_keywords = {
            "high_risk": ["guarantee", "cure", "always", "never", "100%", "risk-free", "get rich", "instant"],
            "medium_risk": ["may", "could", "potential", "possible", "limited time"],
            "safe": ["learn", "discover", "explore", "consider", "consult"]
        }
    
    def analyze_performance_potential(self, copy_variation, industry_rules):
        """Analyze copy for performance potential and compliance risk."""
        text = f"{copy_variation.get('headline', '')} {copy_variation.get('primary_text', '')}".lower()
        
        # Check for risky keywords
        high_risk_count = sum(1 for keyword in self.risk_keywords['high_risk'] if keyword in text)
        medium_risk_count = sum(1 for keyword in self.risk_keywords['medium_risk'] if keyword in text)
        
        # Assess clarity
        has_clear_value_prop = len(copy_variation.get('headline', '')) > 10
        has_clear_cta = len(copy_variation.get('cta', '')) > 3
        
        # Determine risk level
        industry_risk = industry_rules.get('risk_level', 'medium')
        
        if high_risk_count > 0 or (industry_risk == 'high' and medium_risk_count > 2):
            risk_label = "Aggressive / Risky"
            risk_details = "Contains language that may require compliance review"
        elif not has_clear_value_prop or not has_clear_cta:
            risk_label = "Low Clarity"
            risk_details = "Value proposition or CTA could be clearer"
        else:
            risk_label = "Safe & Clear"
            risk_details = "Appropriate tone with clear messaging"
        
        return {
            "label": risk_label,
            "details": risk_details,
            "requires_review": high_risk_count > 0 or industry_risk == 'high'
        }
