class EligibilityCheck
  include Mongoid::Document

  field :timestamp
  field :eligible_id
  field :mapping_version

  belongs_to :enrollment

end