import styled from '#veewme/web/common/styled-components'
import * as React from 'react'

interface TestimponialsContent {
  author: string
  text: string
}

const testimonialsContent: TestimponialsContent[] = [
  {
    author: 'Reuben - AcmeStudios, CA',
    text: `The observation from my agents is “fantastic!” I’ve never been able to get a referral using CirclePix. Now… not an issue. Agents love the entire concept. It’s fresh, inviting, and most importantly Responsive.`
  },
  {
    author: 'Media 2 Market Photography',
    text: `VeewMe gives us a fresh approach to a complete Property Tour and our clients are loving it.`
  },
  {
    author: 'Michelle Meunier Photography',
    text: `I presented several tour options to my client (top 3% KW agent in the country). His final choice was between Ogle Media and TourBuzz. He chose Ogle Media.`
  },
  {
    author: 'Portland, OR Photographer',
    text: `I like it - much easier to use/intuitive than Tourbuzz. My clients love this! More than Tourbuzz!`
  },
  {
    author: 'HomeTourVision',
    text: `We are getting a great response to your platform. You guys really have done a super job!`
  },
  {
    author: 'Motion City Media',
    text: `Delivered my first Ogle Media tour to a client, and wow were they impressed! - Your platform is going to bring us to the next level.`
  },
  {
    author: 'Mixed Media',
    text: `Real estate never looked this good - You said it! Ogle Media blows away any competing real estate virtual tour hosting platform`
  }
]

interface TestimonialsAnimationPattern {
  endAnimationKeyframe: number
  hideTestimonialKeyframe: number
  showTestimonialKeyframe: number
  startAnimationKeyframe: number
}

const testimonialKeyframes: TestimonialsAnimationPattern[] = (() => {
  // Values in range 0 - 1
  const percentOffsetFromAnimationStart = 0.1
  const percentOffsetFromAnimationEnd = 0.9

  const animationBeginning = 0
  const animationFinish = 100

  const singleTestimonialPercentOfCompleteAnimationDuration = animationFinish / testimonialsContent.length
  const singleTestimonialAnimationStartOffset = singleTestimonialPercentOfCompleteAnimationDuration * percentOffsetFromAnimationStart
  const singleTestimonialAnimationEndOffset = singleTestimonialPercentOfCompleteAnimationDuration * percentOffsetFromAnimationEnd

  return testimonialsContent.reduce((animationPatterns: TestimonialsAnimationPattern[]) => {
    const prevousAnimationFinish = animationPatterns[animationPatterns.length - 1]
      ? animationPatterns[animationPatterns.length - 1].endAnimationKeyframe
      : animationBeginning
    animationPatterns.push({
      endAnimationKeyframe: Math.round(prevousAnimationFinish + singleTestimonialPercentOfCompleteAnimationDuration),
      hideTestimonialKeyframe: Math.round(prevousAnimationFinish + singleTestimonialAnimationEndOffset),
      showTestimonialKeyframe: Math.round(prevousAnimationFinish + singleTestimonialAnimationStartOffset),
      startAnimationKeyframe: Math.round(prevousAnimationFinish)
    })
    return animationPatterns
  }, [])
})()

const testimonialKeyframesStyle = testimonialKeyframes.map((animationPattern, index) => {
  const currentChild = index + 1
  return `
    @keyframes testimonial-${currentChild} {
      from,
      ${animationPattern.startAnimationKeyframe}%,
      ${currentChild !== testimonialKeyframes.length ? `${animationPattern.endAnimationKeyframe}%,` : ''}
      to {
        opacity: 0;
        height: 0;
        padding: 0;
      }
      ${animationPattern.showTestimonialKeyframe}%, ${animationPattern.hideTestimonialKeyframe}% {
        opacity: 1;
        height: auto;
        padding: 10px 20px;
      }
    }
    @keyframes line-${currentChild} {
      from,
      ${index !== 0 ? `${animationPattern.startAnimationKeyframe - 1}%,` : ''}
      ${currentChild !== testimonialKeyframes.length ? `${animationPattern.endAnimationKeyframe}%,` : ''}
      to {
        opacity: 0;
      }
      ${animationPattern.startAnimationKeyframe}% {
        width: 1px;
        opacity: 1;
      }
      ${currentChild !== testimonialKeyframes.length ? `${animationPattern.endAnimationKeyframe - 1}%` : '99%'}{
        width: 100%;
        opacity: 1;
      }
    }
  `
})

const secondsOfSingleTestimonialAnimation = 20

const Testimonial = styled.div`
  height: auto;
  border-left: 5px solid ${props => props.theme.colors.BORDER};
  padding: 10px 20px;
  width: 100%;
  text-align: left;
  top: 0;
  left: 0;
  position: relative;
  &:before {
    display: block;
    content: '';
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: ${props => props.theme.colors.GREEN};
    position: absolute;
    top: -30px;
    left: -5px;
  }
`

const TestimonialText = styled.div`
  font-size: 17.5px;
  color: ${props => props.theme.colors.GREEN};
  line-height: 27px;
`

const TestimonialAuthor = styled.div`
  font-size: 14px;
  line-height: 27px;
  color: ${props => props.theme.colors.BLOCK_OF_TEXT};
  &:before {
    display: inline;
    content: '— ';
  }
`

const TestimonialsWrapper = styled.div`
  position: relative;
  min-height: 325px;
  padding: 30px 0 0;
  margin: 30px auto 0;
  grid-column: 2;
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_SM}) {
    min-height: 240px;
  }
  @media (min-width: ${props => props.theme.breakpoints.BREAKPOINT_LG}) {
    margin-top: 15%;
    min-height: 190px;
  }
  & > div {
    ${testimonialsContent.map((testimonial, index) => {
      const currentChild = index + 1
      return `
        &:nth-child(${currentChild}) {
          animation: testimonial-${currentChild} ${secondsOfSingleTestimonialAnimation * testimonialsContent.length}s infinite;
          &:before {
            animation: line-${currentChild} ${secondsOfSingleTestimonialAnimation * testimonialsContent.length}s linear infinite;
          }
        }
      `
    })}
  }
  ${testimonialKeyframesStyle}
`

const Testimonials: React.FunctionComponent = props => {
  return (
    <TestimonialsWrapper>
      {testimonialsContent.map((testimonial, i) => (
        <Testimonial key={i}>
          <TestimonialText>{testimonial.text}</TestimonialText>
          <TestimonialAuthor>{testimonial.author}</TestimonialAuthor>
        </Testimonial>
      ))}
    </TestimonialsWrapper>
  )
}

export default Testimonials
