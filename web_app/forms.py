from django import forms


class LoginForm(forms.Form):
    username = forms.CharField(label='User Name',max_length=64)
    password = forms.CharField(widget=forms.PasswordInput())


class CreateAccountForm(forms.Form):
    username = forms.CharField(label='User Name',max_length=64)
    useremail = forms.CharField(label='Email', widget=forms.EmailInput())
    userfirst = forms.CharField(label='First Name',max_length=64)
    userlast = forms.CharField(label='Last Name',max_length=64)
    password = forms.CharField(label='Password', widget=forms.PasswordInput())
    passwordconfirm = forms.CharField(label='Confirm Password', widget=forms.PasswordInput())


