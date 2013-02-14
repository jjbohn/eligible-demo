class DashboardController < ApplicationController

  def index
    @patients = Patient.all.entries
  end

end