class Enrollment
  include Mongoid::Document

  field :member_id
  belongs_to :patient
  belongs_to :payer

  def to_hash
    {
      member_id: member_id,
      payer_name: payer.name,
      payer_id: payer.payer_id
    }
  end
end