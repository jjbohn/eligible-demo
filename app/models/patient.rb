class Patient
  include Mongoid::Document

  field :last_name,   type: String
  field :first_name,  type: String
  field :dob,         type: String
  
  has_many :enrollments

  def to_hash
    {
      first_name: first_name,
      last_name: last_name,
      dob: dob,
      enrollments: enrollments.map { |e| e.to_hash }
    }
  end
end