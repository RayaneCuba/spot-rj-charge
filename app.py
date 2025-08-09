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
        div[data-testid=\"stAppViewContainer\"] { padding: 0; }
      }
    </style>
    """,
    unsafe_allow_html=True,
)

# Redireciona automaticamente para abrir como página normal (caso iframe seja bloqueado)
redirect_html = f"""
<meta http-equiv=\"refresh\" content=\"0; url={APP_URL}\">
<script>
  try { window.top.location.replace('{APP_URL}'); } catch (e) { window.location.href = '{APP_URL}'; }
</script>
<p style=\"font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, \"\">
  Redirecionando para o ElectroSpot… Se não acontecer, 
  <a href=\"{APP_URL}\" target=\"_self\">clique aqui</a>.
</p>
"""

components.html(redirect_html, height=0)

# Botão de fallback visível
st.link_button("Abrir ElectroSpot agora", APP_URL, type="primary")