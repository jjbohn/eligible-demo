EligibleDemo::Application.routes.draw do
  resources :patients, :payers
  root to: 'dashboard#index'
end
