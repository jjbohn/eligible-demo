EligibleDemo::Application.routes.draw do
  resources :patients
  root to: 'dashboard#index'
end
