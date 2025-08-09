import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="ElectroSpot", 
    page_icon="⚡", 
    layout="wide",
    initial_sidebar_state="collapsed"
)

APP_URL = "https://electrospot.lovable.app"

# CSS para reduzir padding extra do Streamlit
st.markdown(
    """
    <style>
      .main > div { padding-top: 0rem; padding-bottom: 0rem; }
      @media (max-width: 768px) {
        div[data-testid="stAppViewContainer"] { padding: 0; }
      }
    </style>
    """,
    unsafe_allow_html=True,
)

# Tenta incorporar o app (alguns navegadores podem bloquear por política de segurança do site)
components.iframe(APP_URL, height=800, scrolling=True)

st.divider()

# Fallback: link para abrir em nova aba caso a incorporação fique em branco
st.link_button("Abrir ElectroSpot em nova aba", APP_URL, type="primary")
st.caption("Se a visualização incorporada estiver em branco, use o botão acima para abrir em uma nova aba.")