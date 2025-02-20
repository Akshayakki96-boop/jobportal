import React, { Component } from 'react';
import Header from '../Header/header';

class TermsCondition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dashBoardData:""
        };
    }
componentDidMount()
{
    let url = window.location.search;
    var urlParams = new URLSearchParams(url);
    var reqType = urlParams.get('type');
    this.setState({type:reqType});
}
    render() {
        return (
            <>
             <Header dashBoardData={this.state.dashBoardData} />
        {this.state?.type=="Candidate" &&     
        <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', margin: '20px', textAlign: 'justify' }}>
            <h4 style={{ color: '#333' }}>Terms and Conditions for Candidates/Students on Zobskill.com</h4>

            <p><strong>Effective Date:</strong> 28/11/2024</p>

            <div style={{ marginBottom: '30px' }}>
                <p>
                    Welcome to <strong>Zobskill.com</strong>. These Terms and Conditions ("Terms") govern the relationship between <strong>Zobskill.com</strong> (owned and operated by <strong>Eduglobal Solutions Pvt. Ltd</strong>) and you, the <strong>Candidate / Student / Job Seeker / Working Professional</strong>. Zobskill.com is a platform designed to connect candidates / students / working professionals / job seekers with training programs and job opportunities. By registering, enrolling in courses, or availing services on Zobskill.com, you agree to comply with these Terms and Conditions ("Terms"). If you disagree with any part of these Terms, you should refrain from using the platform.
                </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>1. Definitions</h5>
                <ul>
                    <li><strong>Platform:</strong> Zobskill.com, owned and operated by Eduglobal Solutions Pvt. Ltd.</li>
                    <li><strong>Candidate/Student:</strong> An individual registered on the platform to avail training or job placement services.</li>
                    <li><strong>Training Provider:</strong> Trainers or institutions offering courses through Zobskill.com.</li>
                    <li><strong>Related Exam:</strong> The certification or qualifying exam for which the candidate is undergoing training.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>2. Registration and Use of the Platform</h5>
                <ul>
                    <li><strong>Account Creation:</strong> Candidates must create an account, providing accurate and up-to-date information.</li>
                    <li><strong>Eligibility:</strong> Candidates must be at least 18 years old or have parental consent if under 18.</li>
                    <li><strong>Platform Use:</strong> Candidates agree to use the platform solely for the purposes of enrolling in training courses, accessing job opportunities, and related activities.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>3. Course Fees and Payment</h5>
                <ul>
                    <li><strong>Training Fees:</strong> The course fees listed on Zobskill.com exclude <strong>GST (18%)</strong> and <strong>platform fees (3%)</strong>, which will be added during checkout.</li>
                    <li><strong>Payment Terms:</strong> Candidates must pay the full course fee at the time of enrollment. Partial payments are not accepted.</li>
                    <li><strong>Non-Refundable Fees:</strong> GST and platform fees are non-refundable under all circumstances.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>4. Refund Policy</h5>
                <p>Zobskill.com offers a <strong>performance-based refund policy</strong> applicable under the following conditions:</p>
                <h5 style={{ marginTop: '20px' }}>4.1. Refund for Exam Qualification</h5>
                <ul>
                    <li>Candidates are eligible for a <strong>50% refund</strong> of the course fees (excluding GST and platform fees) upon successfully qualifying for the related exam.</li>
                    <li><strong>Refund Process:</strong>
                        <ol>
                            <li>Candidates must submit proof of exam qualification (e.g., scorecard or certificate) within 30 days of result declaration.</li>
                            <li>Zobskill will verify the claim and process the refund within 30 working days.</li>
                        </ol>
                    </li>
                </ul>
                <h5 style={{ marginTop: '20px' }}>4.1. Refund for Exam Qualification</h5>
                <ul>
                    <li>Candidates are eligible for a <strong>50% refund</strong> of the course fees (excluding GST and platform fees) upon successfully qualifying for the related exam.</li>
                    <li><strong>Refund Process:</strong>
                        <ol>
                            <li>Candidates must submit proof of exam qualification (e.g., scorecard or certificate) within 30 days of result declaration.</li>
                            <li>Zobskill will verify the claim and process the refund within 30 working days.</li>
                        </ol>
                    </li>
                </ul>

                <h5 style={{ marginTop: '20px' }}>4.2. Refund for Job Placement</h5>
                <ul>
                    <li>Candidates are eligible for the remaining <strong>50% refund</strong> of the course fees upon successfully securing a job placement through Zobskill.com.</li>
                    <li><strong>Conditions:</strong>
                        <ul>
                            <li>The placement must be secured through Zobskill.com's job portal or recruitment services.</li>
                            <li>Candidate must complete 15 days in the new role before claiming the refund.</li>
                        </ul>
                    </li>
                    <li><strong>Refund Process:</strong>
                        <ol>
                            <li>Submit the placement letter and proof of probation / 15 days work completion.</li>
                            <li>Zobskill will verify and process the refund within 30 working days.</li>
                        </ol>
                    </li>
                </ul>

                <h5 style={{ marginTop: '20px' }}>4.3. Exclusions</h5>
                <ul>
                    <li>Refund benefits are valid only if both the <strong>training</strong> and <strong>placement services</strong> are availed through Zobskill.com.</li>
                    <li>Refunds are not applicable if the candidate opts for external training or job placement services outside Zobskill.com.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>5. Candidate Responsibilities</h5>
                <ul>
                    <li><strong>Accurate Information:</strong> Candidates must provide accurate and truthful details during registration, enrollment, and claim submissions.</li>
                    <li><strong>Adherence to Guidelines:</strong> Candidates must comply with training schedules, platform rules, and trainer instructions.</li>
                    <li><strong>Exam and Placement Efforts:</strong> Candidates are responsible for their active participation in the training program, exam preparation, and job search process.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>6. Prohibited Activities</h5>

                <h5 style={{ marginTop: '20px' }}>6.1. Appropriate Sharing of Contact Information</h5>
                <ul>
                    <li><strong>Permitted Sharing:</strong> Candidates are allowed to share their <strong>contact details (email, phone number, etc.)</strong> with employers during the job application process or when required for professional communication initiated via Zobskill.com.</li>
                    <li><strong>Prohibited Sharing:</strong> Candidates must not share their contact information:
                        <ul>
                            <li>With other candidates, trainers, or users outside the job application or training context.</li>
                            <li>For purposes unrelated to job applications or Zobskill.com services.</li>
                        </ul>
                    </li>
                    <li><strong>Resume Visibility:</strong> Contact details included in resumes uploaded to Zobskill.com are visible to employers as part of the application process and are governed by Zobskill's <strong>Privacy Policy</strong>.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>7. Data Protection and Privacy</h5>
                <ul>
                    <li>Zobskill will handle personal data in accordance with its <strong>Privacy Policy</strong>.</li>
                    <li>Candidate data will only be shared with authorized trainers, employers, or third parties necessary for delivering platform services.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>8. Limitation of Liability</h5>
                <ul>
                    <li>Zobskill.com does not guarantee employment or exam success.</li>
                    <li>The platform is not liable for losses resulting from incorrect use of services or delays in refund processing.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>9. Termination</h5>
                <p>Zobskill.com reserves the right to terminate a candidate's account for:</p>
                <ul>
                    <li>Breaching platform rules or these Terms.</li>
                    <li>Engaging in fraudulent or unethical activities.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>10. Amendments to Terms</h5>
                <p>Zobskill.com may modify these Terms at any time. Candidates will be notified of significant changes, and continued use of the platform constitutes acceptance of the updated Terms.</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>11. Contact Information</h5>
                <p>For queries related to these Terms or refund claims, please contact:</p>
                <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
                    <strong>Email:</strong> <a href="mailto:support@zobskill.com">support@zobskill.com</a>
                </p>
            </div>
        </div>
    }
          {this.state?.type=="Employer" && 
          <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', margin: '20px',textAlign: 'justify' }}>
            <h4 style={{ color: '#333' }}>Employer Terms and Conditions for Zobskill.com</h4>

            <p><strong>Effective Date:</strong> 28/11/2024</p>

            <div style={{ marginBottom: '30px' }}>
                <p>
                    Welcome to <strong>Zobskill.com</strong>. These Terms and Conditions (“Terms”) govern the relationship between <strong>Zobskill.com</strong> (owned and operated by <strong>Eduglobal Solutions Pvt. Ltd.</strong>) and you, the <strong>Employer / Recruiter</strong>. Zobskill.com is an online platform connecting employers and recruiters with skilled candidates across various industries. By posting jobs or using our recruitment services, you agree to these Terms and Conditions (“Terms”). If you do not agree, please refrain from using our services.
                </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>1. Definitions</h5>
                <ul>
                    <li><strong>Platform:</strong> Zobskill.com, owned and operated by Eduglobal Solutions Pvt. Ltd.</li>
                    <li><strong>Employer/Recruiter:</strong> An individual, business, or agency posting job vacancies or seeking candidates through Zobskill.</li>
                    <li><strong>Candidate:</strong> Any individual applying to job listings or using Zobskill services to seek employment.</li>
                    <li><strong>Content:</strong> Information, job postings, company profiles, or any material submitted to Zobskill.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>2. Registration and Account</h5>
                <ul>
                    <li><strong>Account Creation:</strong> Employers must create an account to post job listings, providing accurate and up-to-date information.</li>
                    <li><strong>Authorized Use:</strong> Only authorized personnel of the employer or recruiter’s organization may use the account.</li>
                    <li><strong>Account Security:</strong> Employers are responsible for maintaining the confidentiality of their login credentials and activities performed under their account.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>3. Job Posting Guidelines</h5>
                <ul>
                    <li><strong>Accurate Listings:</strong> Employers must provide truthful, clear, and complete information about job roles, responsibilities, location, and compensation.</li>
                    <li><strong>Prohibited Listings:</strong> Job postings must not include:
                        <ul>
                            <li>False, misleading, or fraudulent information.</li>
                            <li>Discriminatory language or requirements.</li>
                            <li>Jobs requiring upfront payments or violating labor laws.</li>
                        </ul>
                    </li>
                    <li><strong>Compliance with Laws:</strong> Employers must ensure that their job postings and recruitment practices comply with applicable laws and regulations.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>4. Employer Obligations</h5>
                <ul>
                    <li><strong>Candidate Communication:</strong> Employers are expected to communicate professionally and in a timely manner with candidates.</li>
                    <li><strong>Confidentiality:</strong> Employers must protect candidates’ personal information and use it solely for recruitment purposes.</li>
                    <li><strong>No Guarantees:</strong> Zobskill does not guarantee the number of applicants or the quality of candidates for job postings.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>5. Fees and Payments</h5>
                <ul>
                    <li><strong>Job Posting Fees:</strong> Employers are not required to pay fees for job listings, but they will be required to pay for promotional features. Fee details will be specified at the time of purchase.</li>
                    <li><strong>Refund Policy:</strong> Fees paid for services are non-refundable unless otherwise stated in specific agreements.</li>
                    <li><strong>Placement Fees:</strong> If Zobskill facilitates candidate placement, employers may be charged a placement fee, as specified in the service agreement.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>6. Prohibited Conduct</h5>
                <p>Employers must not:</p>
                <ul>
                    <li>Post fake or fraudulent job opportunities.</li>
                    <li>Discriminate against candidates based on race, gender, religion, or other protected categories.</li>
                    <li>Use Zobskill to solicit business unrelated to recruitment or for unauthorized commercial purposes.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>7. Content Ownership and Rights</h5>
                <ul>
                    <li><strong>Employer Content:</strong> Employers retain ownership of the content they submit. However, by posting on Zobskill, employers grant the platform a non-exclusive, royalty-free license to use, display, and promote the content.</li>
                    <li><strong>Platform Content:</strong> Employers must not copy, modify, or distribute Zobskill content without prior authorization.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>8. Termination and Suspension</h5>
                <ul>
                    <li><strong>Employer Termination:</strong> Employers may terminate their account by providing written notice to Zobskill.</li>
                    <li><strong>Platform Suspension:</strong> Zobskill reserves the right to suspend or terminate an employer’s account for violations of these Terms or misuse of the platform.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>9. Limitation of Liability</h5>
                <p>Zobskill is not liable for:</p>
                <ul>
                    <li>Misrepresentation or inaccuracies in job postings by employers.</li>
                    <li>Any disputes between employers and candidates.</li>
                    <li>Losses resulting from unauthorized access to employer accounts.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>10. Privacy Policy</h5>
                <p>All employer and candidate data will be handled in accordance with Zobskill’s Privacy Policy. By using the platform, employers consent to the collection and use of their data as outlined in the policy.</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>11. Dispute Resolution</h5>
                <ul>
                    <li><strong>Employer Disputes:</strong> Employers agree to attempt to resolve disputes with Zobskill amicably before pursuing legal action.</li>
                    <li><strong>Governing Law:</strong> These Terms are governed by the laws of Uttar Pradesh.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>12. Amendments to Terms</h5>
                <p>Zobskill reserves the right to modify these Terms at any time. Employers will be notified of significant changes, and continued use of the platform signifies acceptance of the updated Terms.</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>13. Contact Information</h5>
                <p>For queries or support, please contact:</p>
                <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
                    <strong>Email:</strong> <a href="mailto:employer@zobskill.com">employer@zobskill.com</a>
                </p>
            </div>
        </div>
    }
            {this.state?.type=="Trainer" &&  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', margin: '20px',textAlign: 'justify' }}>
            <h4 style={{ color: '#333' }}>Trainer Terms and Conditions for Zobskill.com</h4>

            <p><strong>Effective Date:</strong> 28/11/2024</p>

            <div style={{ marginBottom: '30px' }}>
                <p>
                    Welcome to <strong>Zobskill.com</strong>. These Terms and Conditions (“Terms”) govern the relationship between <strong>Zobskill.com</strong> (owned and operated by <strong>Eduglobal Solutions Pvt. Ltd</strong>) and you, the <strong>Trainer</strong>, who lists and offers training courses on the platform. By listing courses on Zobskill.com, you agree to these Terms.
                </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>1. Definitions</h5>
                <ul>
                    <li><strong>Platform:</strong> Zobskill.com, the website, and its associated services.</li>
                    <li><strong>Trainer:</strong> An individual or entity listing training courses on Zobskill.com.</li>
                    <li><strong>User/Student:</strong> An individual purchasing or enrolling in a course listed by the Trainer.</li>
                    <li><strong>Content:</strong> All information, descriptions, images, videos, and materials submitted by Trainers for their course listings.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>2. Eligibility</h5>
                <ul>
                    <li>Trainers must be at least 18 years old and legally capable of entering into a binding agreement.</li>
                    <li>Trainers must provide accurate and verifiable information, including certifications, credentials, and payment details.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>3. Trainer Responsibilities</h5>
                <ul>
                    <li><strong>Accurate Information:</strong> Trainers are required to provide accurate and truthful information about their courses, including duration, fees, certifications offered, and learning outcomes.</li>
                    <li><strong>Compliance with Laws:</strong> Trainers are responsible for ensuring their courses comply with all applicable laws, regulations, and intellectual property rights.</li>
                    <li><strong>Quality Standards:</strong> Trainers must ensure that the courses meet the quality standards set by Zobskill.com. The platform reserves the right to audit or review courses for compliance.</li>
                    <li><strong>Timely Delivery:</strong> Trainers must adhere to the schedules and commitments made to students for delivering the course content.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>4. Course Listing and Approval</h5>
                <ul>
                    <li>Zobskill.com reserves the right to review and approve all course listings before they go live on the platform.</li>
                    <li>Listings that violate these Terms or are deemed inappropriate will be rejected or removed without prior notice.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>5. Revenue Sharing and Payments</h5>
                <ul>
                    <li><strong>Commission Structure:</strong> Zobskill.com will deduct a 20% commission from each course sale. The remaining balance will be transferred to the Trainer excluding the GST component.</li>
                    <li><strong>Payment Schedule:</strong> Payments to Trainer will be made in 2 instalments. The 1st instalment will be paid on the first day of the training class, and the 2nd instalment will be paid during the mid-course of the total course duration.</li>
                    <li><strong>Refunds:</strong> When a student qualifies for a refund, it will not be deducted from the Trainer’s fees. Instead, Zobskill.com will refund that amount to the eligible student once their scorecard is verified by us.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>6. Intellectual Property</h5>
                <ul>
                    <li><strong>Trainer’s Content:</strong> Trainers retain ownership of their course materials. However, by listing on Zobskill.com, Trainers grant the platform a non-exclusive license to use, promote, and display the course content.</li>
                    <li><strong>Prohibited Content:</strong> Trainers must not upload content that is defamatory, infringing, obscene, or otherwise unlawful.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>7. Termination</h5>
                <ul>
                    <li><strong>By the Trainer:</strong> Trainers may terminate their account at any time by providing written notice to Zobskill.com.</li>
                    <li><strong>By Zobskill:</strong> Zobskill.com reserves the right to suspend or terminate a Trainer’s account for violations of these Terms, failure to deliver promised services, or other breaches of trust.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>8. Limitation of Liability</h5>
                <p>Zobskill.com is not liable for:</p>
                <ul>
                    <li>Any disputes between Trainers and students.</li>
                    <li>Loss of revenue or opportunities due to platform downtime or technical issues.</li>
                    <li>Content uploaded by Trainers that violates intellectual property rights.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>9. Confidentiality</h5>
                <ul>
                    <li>Trainers must keep all user data confidential and use it solely for the purpose of delivering the course.</li>
                    <li>Misuse of user data will result in immediate termination and potential legal action.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>10. Dispute Resolution</h5>
                <ul>
                    <li><strong>Disputes with Users:</strong> Trainers are responsible for resolving disputes with students regarding their courses. Zobskill.com may mediate at its discretion but is not obligated to do so.</li>
                    <li><strong>Disputes with Zobskill:</strong> Any disputes between Trainers and Zobskill.com will be subject to arbitration under the jurisdiction of Uttar Pradesh.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>11. Restrictions on Sharing Personal Contact Information</h5>
                <ul>
                    <li><strong>Prohibition of Contact Sharing:</strong> Trainers are strictly prohibited from sharing personal contact details, including but not limited to email addresses, phone numbers, and social media account details, in any form. This includes:
                        <ul>
                            <li>Promotional Videos: Any promotional or introductory videos uploaded on Zobskill.com.</li>
                            <li>Live Classes or Feedback Sessions: Interactions with students during live training sessions or feedback activities.</li>
                        </ul>
                    </li>
                    <li><strong>Permissible Communication Channels:</strong> Trainers may only communicate with candidates via the following approved channels:
                        <ul>
                            <li>Zobskill Platform: Direct communication through the integrated messaging or chat features on Zobskill.</li>
                            <li>Zobskill’s WhatsApp Community Channel: Managed and monitored by Zobskill for safe and professional interactions.</li>
                        </ul>
                    </li>
                    <li><strong>Breach of Terms:</strong> Sharing personal contact details with candidates sourced by Zobskill.com or through candidate referrals will be considered a Breach of Contract. In such cases:
                        <ul>
                            <li>Zobskill reserves the right to take legal action against the Trainer.</li>
                            <li>The Trainer’s account may be suspended or terminated immediately without notice.</li>
                        </ul>
                    </li>
                    <li><strong>Monitoring and Enforcement:</strong> Zobskill reserves the right to monitor communications on its platform to ensure compliance with this clause. Violations will result in strict action as outlined above.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>12. Amendments</h5>
                <p>Zobskill.com reserves the right to modify these Terms at any time. Trainers will be notified of changes, and continued use of the platform constitutes acceptance of the updated Terms.</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h5 style={{ borderBottom: '2px solid #333', paddingBottom: '5px' }}>13. Contact</h5>
                <p>For queries or support, Trainers may contact:</p>
                <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
                    <strong>Email:</strong> <a href="mailto:trainer@zobskill.com">trainer@zobskill.com</a>
                </p>
            </div>
        </div>
    }
            </>
        );
    }
}

export default TermsCondition;