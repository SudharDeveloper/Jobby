import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FiSearch} from 'react-icons/fi'
import Header from '../Header'
import JobItem from '../JobItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profile: {},
    jobsList: [],
    search: '',
    employmentType: [],
    minimumPackage: '',
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {search, employmentType, minimumPackage} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${minimumPackage}&search=${search}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedJobs = data.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedJobs,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedProfile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profile: updatedProfile,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  onSearchChange = event => {
    this.setState({search: event.target.value})
  }

  onEmploymentChange = event => {
    const {value, checked} = event.target
    if (checked) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, value],
        }),
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          employmentType: prevState.employmentType.filter(
            each => each !== value,
          ),
        }),
        this.getJobs,
      )
    }
  }

  onSalaryChange = event => {
    const {value} = event.target
    this.setState({minimumPackage: value}, this.getJobs)
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  renderProfile = () => {
    const {profile, profileApiStatus} = this.state

    if (profileApiStatus === apiStatusConstants.inProgress) {
      return this.renderLoader()
    }

    if (profileApiStatus === apiStatusConstants.success) {
      return (
        <div className="profile">
          <img
            src={profile.profileImageUrl}
            className="profile-image"
            alt="profile"
          />
          <h3 className="name">{profile.name}</h3>
          <p className="bio">{profile.shortBio}</p>
        </div>
      )
    }

    if (profileApiStatus === apiStatusConstants.failure) {
      return (
        <div className="profile-failure">
          <button
            type="button"
            onClick={this.getProfile}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      )
    }

    return null
  }

  renderNoJobsView = () => (
    <div className="no-jobs-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobsFailureView = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getJobs} className="retry-button">
        Retry
      </button>
    </div>
  )

  renderJobsList = () => {
    const {jobsList, jobsApiStatus} = this.state

    if (jobsApiStatus === apiStatusConstants.inProgress) {
      return this.renderLoader()
    }

    if (jobsApiStatus === apiStatusConstants.success) {
      if (jobsList.length === 0) {
        return this.renderNoJobsView()
      }
      return (
        <ul className="jobs-list">
          {jobsList.map(eachItem => (
            <JobItem key={eachItem.id} jobDetails={eachItem} />
          ))}
        </ul>
      )
    }

    if (jobsApiStatus === apiStatusConstants.failure) {
      return this.renderJobsFailureView()
    }

    return null
  }

  render() {
    const {search} = this.state

    const employmentTypesList = [
      {label: 'Full Time', employmentTypeId: 'FULLTIME'},
      {label: 'Part Time', employmentTypeId: 'PARTTIME'},
      {label: 'Freelance', employmentTypeId: 'FREELANCE'},
      {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
    ]

    const salaryRangesList = [
      {salaryRangeId: '1000000', label: '10 LPA and above'},
      {salaryRangeId: '2000000', label: '20 LPA and above'},
      {salaryRangeId: '3000000', label: '30 LPA and above'},
      {salaryRangeId: '4000000', label: '40 LPA and above'},
    ]

    return (
      <div className="jobs-containers">
        <Header />
        <div className="jobs-container">
          <div className="jobs-1">
            {this.renderProfile()}
            <hr />
            <div className="type">
              <h3>Type of Employment</h3>
              <ul>
                {employmentTypesList.map(eachType => (
                  <li key={eachType.employmentTypeId}>
                    <input
                      onChange={this.onEmploymentChange}
                      type="checkbox"
                      id={eachType.employmentTypeId}
                      value={eachType.employmentTypeId}
                    />
                    <label htmlFor={eachType.employmentTypeId}>
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="salary-range">
              <h3>Salary Range</h3>
              <ul>
                {salaryRangesList.map(eachSalary => (
                  <li key={eachSalary.salaryRangeId}>
                    <input
                      onChange={this.onSalaryChange}
                      type="radio"
                      id={eachSalary.salaryRangeId}
                      name="salaryRange"
                      value={eachSalary.salaryRangeId}
                    />
                    <label htmlFor={eachSalary.salaryRangeId}>
                      {eachSalary.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="jobs-2">
            <div className="search-container">
              <input
                type="search"
                value={search}
                onChange={this.onSearchChange}
                placeholder="Search"
                className="search-input"
              />
              <button
                type="button"
                onClick={this.getJobs}
                className="search-button"
                data-testid="searchButton"
              >
                <FiSearch />
              </button>
            </div>

            {this.renderJobsList()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
