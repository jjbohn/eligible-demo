class Payer
  include Mongoid::Document

  field :name,      type: String
  field :payer_id,  type: String
end