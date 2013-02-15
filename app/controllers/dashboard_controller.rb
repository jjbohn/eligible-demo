class DashboardController < ApplicationController

  def index
    @patients = Patient.all.entries
    @payers = Payer.all.entries
  end

end