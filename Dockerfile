FROM public.ecr.aws/lambda/nodejs:22

# Copy function code
COPY . .

# install dependencies
RUN npm install

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
# CMD [ "sign-admin-set-config.sign_admin_set_config" ]