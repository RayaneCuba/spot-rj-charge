import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="ElectroSpot", 
    page_icon="⚡", 
    layout="wide",
    initial_sidebar_state="collapsed"
)

APP_URL = "https://electrospot.lovable.app"

# HTML responsivo que se adapta ao tamanho da tela
responsive_html = f"""
<div style="width: 100%; height: 100vh; min-height: 600px;">
    <iframe 
        src="{APP_URL}" 
        style="
            width: 100%; 
            height: 100%; 
            border: none; 
            display: block;
        "
        frameborder="0"
        allowfullscreen>
    </iframe>
</div>

<style>
    /* Remove espaços extras do Streamlit */
    .main > div {{
        padding-top: 0rem;
        padding-bottom: 0rem;
    }}
    
    /* Responsivo para diferentes tamanhos */
    @media (max-width: 768px) {{
        div[data-testid="stAppViewContainer"] {{
            padding: 0;
        }}
    }}
</style>
"""

components.html(responsive_html, height=700)