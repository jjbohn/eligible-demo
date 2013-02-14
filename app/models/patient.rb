class Patient
  include Mongoid::Document

  field :last_name,   type: String
  field :first_name,  type: String
  field :dob,         type: String
  field :member_id,   type: String
end