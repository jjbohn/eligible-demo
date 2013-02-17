class EligibilityCheck
  include Mongoid::Document

  COVERAGE_STATUS_CODES = {
    "1" => "Active Coverage",
    "2" => "Active - Full Risk Capitation",
    "3" => "Active - Services Capitated",
    "4" => "Active - Services Capitated to Primary Care Physician",
    "5" => "Active - Pending Investigation",
    "6" => "Inactive",
    "7" => "Inactive - Pending Eligibility Update",
    "8" => "Inactive - Pending Investigation",
    "I" => "Not-Covered",
    "V" => "Cannot process"
  }

  field :timestamp
  field :eligible_id
  field :mapping_version
  field :response,        type: Hash

  belongs_to :enrollment

  def coverage_status_description
    return nil unless response["coverage_status"]
    COVERAGE_STATUS_CODES[response["coverage_status"]]
  end

  def endpoint
    mapping_version ? mapping_version.match(/[^\s]+/)[0] : nil
  end

end