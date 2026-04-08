const forgotPaswordTemplate = ({ name, otp }) => {
    return `
   <div style="width: 600px; max-width: 600px; background: white; box-shadow: 0px 4px 6px -4px rgba(0, 0, 0, 0.10), 0px 10px 15px -3px rgba(0, 0, 0, 0.10); overflow: hidden; border-radius: 12px; outline: 1px #E2E8F0 solid; outline-offset: -1px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex">
  <div style="align-self: stretch; padding-top: 32px; padding-bottom: 32px; border-bottom: 1px #F1F5F9 solid; background-image: url(https://placehold.co/598x107); justify-content: center; align-items: flex-start; display: inline-flex">
    <div style="justify-content: flex-start; align-items: center; gap: 10.04px; display: flex">
      <div style="width: 10.31px; height: 9.27px; outline: 1.54px black solid; outline-offset: -0.77px"></div>
      <div style="width: 9.45px; height: 11.97px; outline: 1.54px black solid; outline-offset: -0.77px"></div>
      <div style="width: 24.33px; height: 16.22px; background: black; border-radius: 2.32px"></div>
      <div style="width: 196.18px; color: #364EF2; font-size: 28px; font-family: Poppins; font-weight: 600; word-wrap: break-word">Campus Mart</div>
    </div>
  </div>
  <div style="align-self: stretch; padding-left: 32px; padding-right: 32px; padding-top: 40px; padding-bottom: 40px; flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
    <div style="width: 64px; height: 88px; padding-bottom: 24px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
      <div style="width: 64px; height: 64px; background: #EFF6FF; border-radius: 9999px; justify-content: center; align-items: center; display: inline-flex">
        <div style="flex-direction: column; justify-content: flex-start; align-items: center; display: inline-flex">
          <div style="width: 26.67px; height: 26.67px; background: #394FF1"></div>
        </div>
      </div>
    </div>
    <div style="padding-bottom: 12px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
      <div style="flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
        <div style="width: 308.30px; height: 35px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #0F172A; font-size: 28px; font-family: Inter; font-weight: 700; line-height: 35px; word-wrap: break-word">Your Verification Code</div>
      </div>
    </div>
    <div style="max-width: 400px; padding-left: 16.83px; padding-right: 16.83px; flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
      <div style="width: 366.34px; height: 78px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #64748B; font-size: 16px; font-family: Inter; font-weight: 400; line-height: 26px; word-wrap: break-word">Thank you ${name} for signing up for our platform! We're excited to have you on board. </div>
    </div>
    <div style="align-self: stretch; padding-top: 32px; padding-bottom: 32px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
      <div style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 24px; padding-bottom: 24px; background: #F8FAFC; border-radius: 12px; outline: 1px #F1F5F9 solid; outline-offset: -1px; justify-content: center; align-items: center; display: inline-flex">
        <div style="flex-direction: column; justify-content: flex-start; align-items: center; display: inline-flex">
          <div style="width: 144.03px; height: 36px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #1E293B; font-size: 30px; font-family: Liberation Mono; font-weight: 700; line-height: 36px; letter-spacing: 6px; word-wrap: break-word">${otp}</div>
        </div>
      </div>
    </div>
    <div style="height: 48px; min-width: 200px; padding-left: 43.17px; padding-right: 43.17px; background: #394FF1; box-shadow: 0px 1px 2px #BFDBFE; border-radius: 8px; justify-content: center; align-items: center; gap: 8px; display: inline-flex">
      <div style="flex-direction: column; justify-content: flex-start; align-items: center; display: inline-flex">
        <div style="width: 14.17px; height: 16.67px; background: white"></div>
      </div>
      <div style="flex-direction: column; justify-content: flex-start; align-items: center; display: inline-flex">
        <div style="width: 85.66px; height: 24px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: white; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">Copy Code</div>
      </div>
    </div>
    <div style="padding-top: 24px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
      <div style="padding-left: 12px; padding-right: 12px; padding-top: 6px; padding-bottom: 6px; background: #F8FAFC; border-radius: 9999px; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
        <div style="flex-direction: column; justify-content: flex-start; align-items: center; display: inline-flex">
          <div style="width: 12px; height: 14px; background: #94A3B8"></div>
        </div>
        <div style="flex-direction: column; justify-content: flex-start; align-items: center; display: inline-flex">
          <div style="width: 211.81px; height: 20px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #94A3B8; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 20px; word-wrap: break-word">This code is valid for 10 minutes</div>
        </div>
      </div>
    </div>
  </div>
  <div style="align-self: stretch; padding-left: 32px; padding-right: 32px; padding-top: 24px; padding-bottom: 24px; background: #F8FAFC; border-top: 1px #F1F5F9 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: flex">
    <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
      <div style="width: 202px; height: 20px; text-align: center; justify-content: center; display: flex; flex-direction: column"><span style="color: #64748B; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 20px; word-wrap: break-word">Need help? </span><span style="color: #394FF1; font-size: 14px; font-family: Inter; font-weight: 500; word-wrap: break-word">Contact Support</span></div>
    </div>
    <div style="align-self: stretch; justify-content: center; align-items: flex-start; gap: 16px; display: inline-flex">
      <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex">
        <div style="width: 20px; height: 20px; position: relative; overflow: hidden">
          <div style="width: 16.67px; height: 13.54px; left: 1.67px; top: 3.33px; position: absolute; background: #94A3B8"></div>
        </div>
      </div>
      <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex">
        <div style="width: 20px; height: 20px; position: relative; overflow: hidden">
          <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #94A3B8"></div>
        </div>
      </div>
    </div>
    <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
      <div style="width: 248.27px; height: 32px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #94A3B8; font-size: 12px; font-family: Inter; font-weight: 400; line-height: 16px; word-wrap: break-word">© 2024 SecureFlow Inc. All rights reserved.<br/>123 Security Blvd, Tech City, TC 90210</div>
    </div>
  </div>
</div>
    `
}
export default forgotPaswordTemplate;