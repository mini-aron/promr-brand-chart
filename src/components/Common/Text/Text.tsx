import { theme } from "@/theme";
import { css } from "@emotion/react";


function Title({ title }: { title: string }) {
    return(
        <h1 css={css({ fontSize: 24, fontWeight: 600, marginBottom: theme.spacing(2), color: theme.colors.text })}>{title}</h1>
    )
}

function Subtitle({ subtitle }: { subtitle: string }) {
    return(
        <h2 css={css({ fontSize: 16, fontWeight: 600, marginBottom: theme.spacing(2), color: theme.colors.text })}>{subtitle}</h2>
    )
}

export { Title, Subtitle };