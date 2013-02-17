EligibleDemo::Application.routes.draw do
  resources :patients, :payers, :eligibility_checks
  root to: 'dashboard#index'
end
