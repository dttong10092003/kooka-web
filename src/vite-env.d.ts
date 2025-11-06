/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_GATEWAY_URL: string
  readonly VITE_AUTH_SERVICE_URL: string
  readonly VITE_USER_SERVICE_URL: string
  readonly VITE_RECIPE_SERVICE_URL: string
  readonly VITE_PYTHON_COOK_SERVICE_URL: string
  readonly VITE_MEALPLAN_SERVICE_URL: string
  readonly VITE_LIKE_SERVICE_URL: string
  readonly VITE_FAVORITE_SERVICE_URL: string
  readonly VITE_REVIEW_SERVICE_URL: string
  readonly VITE_CHATBOT_SERVICE_URL: string
  // Thêm các biến môi trường khác nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
