// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const vaccineStatusValues = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initially: 'INITIALLY',
}

class CowinDashboard extends Component {
  state = {cowinData: [], vaccineStatus: vaccineStatusValues.initially}

  componentDidMount() {
    this.cowinDataApi()
  }

  cowinDataApi = async () => {
    this.setState({vaccineStatus: vaccineStatusValues.loading})
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        dataVaccinationByAge: data.vaccination_by_age,
        dataVaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({
        cowinData: updatedData,
        vaccineStatus: vaccineStatusValues.success,
      })
    } else {
      this.setState({vaccineStatus: vaccineStatusValues.failure})
    }
  }

  renderCowinData = () => {
    const {cowinData} = this.state
    const {
      last7DaysVaccination,
      dataVaccinationByAge,
      dataVaccinationByGender,
    } = cowinData

    return (
      <>
        <VaccinationCoverage VaccinationCoverageData={last7DaysVaccination} />
        <VaccinationByGender
          VaccinationByGenderData={dataVaccinationByGender}
        />
        <VaccinationByAge vaccinationByAgeDataSet={dataVaccinationByAge} />
      </>
    )
  }

  loadingStatus = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="text">Something Went Wrong</h1>
    </div>
  )

  checkCowinStatus = () => {
    const {vaccineStatus} = this.state
    switch (vaccineStatus) {
      case vaccineStatusValues.success:
        return this.renderCowinData()
      case vaccineStatusValues.loading:
        return this.loadingStatus()
      case vaccineStatusValues.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-app-container">
        <div className="logo-container">
          <img
            className="logo-img"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <p className="logo-text">Co-WIN</p>
        </div>
        <h1 className="main-title">CoWIN Vaccination in India</h1>
        <div className="cowinCharts-container">{this.checkCowinStatus()}</div>
      </div>
    )
  }
}
export default CowinDashboard
