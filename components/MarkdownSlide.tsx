import { Deck, MarkdownSlideSet, FlexBox } from "spectacle"

interface Props {
    markdown: string
    width: string
    height: string
}

const MarkdownSlide = (props: Props) => {
    const theme = {
        backdropStyle: {
            width: props.width,
            height: props.height,
            lineHeight: 1,
        },
        lineHeights: 2,
    }
 
    return (
        <Deck theme={theme}>
            <FlexBox>
                <MarkdownSlideSet>{props.markdown}</MarkdownSlideSet>
            </FlexBox>
        </Deck>
    )
}

export default MarkdownSlide
