---
    title: Simple Vue.js Form Validation with Vuelidate
    date: 2018-08-27
    categories: [북마크, Vue]
    banner:
        url: https://vuejsdevelopers.com/images/posts/versions/form_handling_vuelidate_1200.webp
---

![](https://vuejsdevelopers.com/images/posts/versions/form_handling_vuelidate_1200.webp)

Thanks to Vue's reactivity model, it's really easy to roll your own form validations. This can be done with a simple method call on the form submit, or a computed property evaluating input data on each change.

Using your form validation can quickly become cumbersome and annoying, however, especially when the number of inputs in the form increase, or the form structure gets more complicated e.g. multi-step forms.

Thankfully, there are great validation plugins for Vue like Vuelidate. In this article, we'll be looking at how Vuelidate can be used to simplify:

- Validation
- Multi-step form validation
- Child component validation
- Error messages

We'll also see how the Vuelidate-error-extractor plugin can be used to simplify error message display per input, or as an error summary above or below the form.

[Simple Vue.js Form Validation with Vuelidate](https://vuejsdevelopers.com/2018/08/27/vue-js-form-handling-vuelidate/)