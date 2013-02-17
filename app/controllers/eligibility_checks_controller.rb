class EligibilityChecksController < ApplicationController
  respond_to :json

  def create
    param_keys = [:payer_name, :payer_id, :service_provider_last_name,
      :service_provider_first_name, :service_provider_NPI, :subscriber_id,
      :subscriber_last_name, :subscriber_first_name, :subscriber_dob,
      :service_type_code]

    filtered_params = params.select do |k, v| 
      param_keys.include?(k.to_sym)
    end

    puts filtered_params
    Eligible.api_key = params[:api_key]

    begin
      service = Eligible::Service.get(filtered_params)
    rescue Eligible::EligibleError => e
      render json: { error: e.message } and return 
    end
    puts service.inspect

    render json: { error: service.error } and return unless service.all
    puts filtered_params
    ec = EligibilityCheck.create({
      response: service.all,
      timestamp: service.all[:timestamp],
      eligible_id: service.all[:eligible_id],
      mapping_version: service.all[:mapping_version],
      enrollment: Enrollment.where(payer: Payer.where(payer_id: filtered_params["payer_id"]).first, member_id: params[:subscriber_id]).first
      })

    render json: ec.to_json
  end

end