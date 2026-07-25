import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    skills: [],
    lifeAtCompany: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const updatedJob = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }

      const updatedSkills = data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))

      const updatedLifeAtCompany = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }

      const updatedSimilarJobs = data.similar_jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobDetails: updatedJob,
        skills: updatedSkills,
        lifeAtCompany: updatedLifeAtCompany,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getJobDetails()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onRetry} className="retry-button">
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails, skills, lifeAtCompany, similarJobs} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
    } = jobDetails

    return (
      <div className="job-details-bg">
        <div className="job-details-card">
          <div className="top-section">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-container">
              <h2>{title}</h2>
              <div className="rating-container">
                <FaStar className="star-icon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>

          <div className="middle-section">
            <div className="location-employment">
              <div className="icon-text">
                <MdLocationOn className="icon" />
                <p>{location}</p>
              </div>
              <div className="icon-text">
                <BsBriefcaseFill className="icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>

          <hr />

          <div className="description-header">
            <h1>Description</h1>
            <a
              href={companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="visit-link"
            >
              Visit
              <FaExternalLinkAlt className="visit-icon" />
            </a>
          </div>

          <p className="description">{jobDescription}</p>

          <h1>Skills</h1>
          <ul className="skills-list">
            {skills.map(each => (
              <li key={each.name} className="skill-item">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skill-image"
                />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>

          <h1>Life at Company</h1>
          <div className="life-company">
            <p className="life-description">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-image"
            />
          </div>
        </div>

        <h1 className="similar-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(eachJob => (
            <SimilarJobItem key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderJobDetails()}
      </>
    )
  }
}

export default JobItemDetails
