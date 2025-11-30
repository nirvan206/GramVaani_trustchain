import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FileText, DollarSign, Calendar, Target } from 'lucide-react';
import useDemoStore from '../store/useDemoStore';
import useAuthStore from '../store/useAuthStore';

function ApplyLoan() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [incomeConfirmed, setIncomeConfirmed] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      interestRate: 5
    }
  });
  
  const addDemoLoan = useDemoStore((state) => state.addDemoLoan);
  const user = useAuthStore((state) => state.user);

  const amount = watch('amount', 0);
  const interestRate = watch('interestRate', 5);
  const duration = watch('duration', 30);

  const calculateInterest = () => {
    return (amount * interestRate) / 10000;
  };

  const calculateTotal = () => {
    return parseFloat(amount) + calculateInterest();
  };

  const onSubmit = async (data) => {
    // Validate checkboxes
    if (!termsAccepted || !ageConfirmed || !incomeConfirmed) {
      toast.error('Please confirm all conditions before submitting');
      return;
    }

    try {
      setLoading(true);

      // Add to demo data
      const newLoan = {
        blockchainLoanId: `${Date.now()}`,
        borrower: {
          _id: user.id,
          name: user.name,
          walletAddress: user.walletAddress
        },
        amount: parseFloat(data.amount),
        interestRate: parseInt(data.interestRate),
        duration: parseInt(data.duration),
        purpose: data.purpose,
        collateral: data.collateral || '',
        status: 'pending',
        repaidAmount: 0,
        createdAt: new Date().toISOString()
      };

      addDemoLoan(newLoan);
      toast.success('Loan application submitted successfully! (Demo mode)');
      navigate('/loans');
    } catch (error) {
      console.error('Apply loan error:', error);
      toast.error('Failed to submit loan application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Apply for Loan</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to submit your loan application
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
            {/* Amount */}
            <div>
              <label className="label flex items-center space-x-2">
                <DollarSign size={18} />
                <span>Loan Amount (₹)</span>
              </label>
              <input
                type="number"
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 1000, message: 'Minimum amount is ₹1,000' },
                  max: { value: 1000000, message: 'Maximum amount is ₹10,00,000' },
                })}
                className="input-field"
                placeholder="Enter amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Minimum: ₹1,000 | Maximum: ₹10,00,000
              </p>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="label">Interest Rate (% per annum)</label>
              <input
                type="number"
                step="0.1"
                {...register('interestRate', {
                  required: 'Interest rate is required',
                  min: { value: 5, message: 'Minimum rate is 5%' },
                  max: { value: 30, message: 'Maximum rate is 30%' },
                })}
                className="input-field"
                placeholder="Enter interest rate"
              />
              {errors.interestRate && (
                <p className="text-red-500 text-sm mt-1">{errors.interestRate.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Typical range: 10-18% per annum
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="label flex items-center space-x-2">
                <Calendar size={18} />
                <span>Duration (days)</span>
              </label>
              <input
                type="number"
                {...register('duration', {
                  required: 'Duration is required',
                  min: { value: 7, message: 'Minimum duration is 7 days' },
                  max: { value: 365, message: 'Maximum duration is 365 days' },
                })}
                className="input-field"
                placeholder="Enter duration"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Minimum: 7 days | Maximum: 365 days
              </p>
            </div>

            {/* Purpose */}
            <div>
              <label className="label flex items-center space-x-2">
                <Target size={18} />
                <span>Purpose of Loan</span>
              </label>
              <select {...register('purpose', { required: 'Purpose is required' })} className="input-field">
                <option value="">Select purpose</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Small Business">Small Business</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Home Improvement">Home Improvement</option>
                <option value="Livestock">Livestock</option>
                <option value="Equipment Purchase">Equipment Purchase</option>
                <option value="Working Capital">Working Capital</option>
                <option value="Other">Other</option>
              </select>
              {errors.purpose && (
                <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
              )}
            </div>

            {/* Collateral */}
            <div>
              <label className="label">Collateral (Optional)</label>
              <textarea
                {...register('collateral')}
                className="input-field"
                rows="3"
                placeholder="Describe any collateral you can offer (e.g., land, equipment, jewelry)"
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                Providing collateral may improve your chances of approval
              </p>
            </div>

            {/* Loan Conditions */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Borrower Conditions</h3>
              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that I am at least 18 years old and legally eligible to apply for a loan
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incomeConfirmed}
                    onChange={(e) => setIncomeConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    I have a stable source of income and can repay this loan on time
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the terms and conditions, and understand that failure to repay may affect my trust score
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !termsAccepted || !ageConfirmed || !incomeConfirmed}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            {(!termsAccepted || !ageConfirmed || !incomeConfirmed) && (
              <p className="text-sm text-red-600 text-center mt-2">
                Please confirm all conditions above to submit
              </p>
            )}
          </form>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Loan Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Principal Amount</span>
                <span className="font-semibold text-gray-900">
                  ₹{parseFloat(amount || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Interest Rate</span>
                <span className="font-semibold text-gray-900">{interestRate}%</span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold text-gray-900">{duration} days</span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Interest Amount</span>
                <span className="font-semibold text-gray-900">
                  ₹{calculateInterest().toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-3 bg-primary-50 rounded-lg px-3">
                <span className="font-semibold text-gray-900">Total Repayment</span>
                <span className="font-bold text-primary-600 text-lg">
                  ₹{calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your loan will be reviewed by lenders. 
                Higher trust scores get faster approvals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyLoan;
