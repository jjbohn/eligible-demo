class PatientsController < ApplicationController
  respond_to :json

  def create
    patient = Patient.create({
      last_name: params[:last_name],
      first_name: params[:first_name],
      dob: params[:dob]
      })

    payer = Payer.where(payer_id: params[:payer_id]).first

    unless payer
      payer = Payer.create({
        payer_id: params[:payer_id],
        name: params[:payer_name]
        })
    end

    enrollment = Enrollment.create({
      patient: patient,
      payer: payer,
      member_id: params[:member_id]
      })

    json = patient.to_hash.to_json

    render json: json
  end
  
end