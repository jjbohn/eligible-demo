class Patient
  include Mongoid::Document

  field :last_name
  field :first_name
  field :dob
  
  has_many :enrollments

  def to_hash
    {
      first_name: first_name,
      last_name: last_name,
      dob: dob,
      enrollments: enrollments.map { |e| e.to_hash }
    }
  end

  def member_id
    enrollments.first.try(:member_id)
  end

  def payer_name
    enrollments.first.try(:payer).try(:name)
  end
end