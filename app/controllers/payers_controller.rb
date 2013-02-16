class PayersController < ApplicationController

  def update
    payer = Payer.where(payer_id: params[:id]).first

    head 404 unless payer

    payer.accepted = params[:accepted].present? && params[:accepted] != "false"
    payer.save

    head 200
  end

end