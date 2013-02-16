class Payer
  include Mongoid::Document

  field :name
  field :payer_id
  field :accepted, type: Boolean  

  has_many :enrollments
end