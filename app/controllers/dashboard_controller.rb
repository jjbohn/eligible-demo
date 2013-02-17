class DashboardController < ApplicationController

  def index
    @patients = Patient.all.entries
    @payers = Payer.all.entries
    @eligibility_checks = EligibilityCheck.all.entries
  end

end